// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract CulturalVoting is SepoliaConfig {

    address public admin;
    uint8 public currentVotingRound;

    struct CulturalProject {
        string name;
        string description;
        string category;
        address proposer;
        bool isActive;
        uint256 proposalTime;
    }

    struct Vote {
        euint8 encryptedScore;
        bool hasVoted;
        uint256 timestamp;
    }

    struct VotingRound {
        uint8[] projectIds;
        bool votingActive;
        bool resultsRevealed;
        uint256 startTime;
        uint256 endTime;
        address[] voters;
        uint8 winningProjectId;
        uint8 maxScore;
    }

    mapping(uint8 => CulturalProject) public projects;
    mapping(uint8 => VotingRound) public votingRounds;
    mapping(uint8 => mapping(uint8 => mapping(address => Vote))) public votes; // round => projectId => voter => vote
    mapping(address => bool) public authorizedVoters;

    uint8 public totalProjects;

    event ProjectProposed(uint8 indexed projectId, string name, address proposer);
    event VotingRoundStarted(uint8 indexed round, uint8[] projectIds, uint256 startTime);
    event VoteSubmitted(address indexed voter, uint8 indexed round, uint8 indexed projectId);
    event ResultsRevealed(uint8 indexed round, uint8 winningProjectId, uint8 maxScore);
    event VoterAuthorized(address indexed voter);
    event VoterRevoked(address indexed voter);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    modifier onlyAuthorizedVoter() {
        require(authorizedVoters[msg.sender], "Not authorized to vote");
        _;
    }

    modifier onlyDuringVoting() {
        require(votingRounds[currentVotingRound].votingActive, "Voting not active");
        _;
    }

    constructor() {
        admin = msg.sender;
        currentVotingRound = 1;
        authorizedVoters[msg.sender] = true;
    }

    function proposeProject(
        string memory _name,
        string memory _description,
        string memory _category
    ) external {
        totalProjects++;

        projects[totalProjects] = CulturalProject({
            name: _name,
            description: _description,
            category: _category,
            proposer: msg.sender,
            isActive: true,
            proposalTime: block.timestamp
        });

        emit ProjectProposed(totalProjects, _name, msg.sender);
    }

    function authorizeVoter(address _voter) external onlyAdmin {
        authorizedVoters[_voter] = true;
        emit VoterAuthorized(_voter);
    }

    function revokeVoter(address _voter) external onlyAdmin {
        authorizedVoters[_voter] = false;
        emit VoterRevoked(_voter);
    }

    function startVotingRound(uint8[] memory _projectIds) external onlyAdmin {
        require(!votingRounds[currentVotingRound].votingActive, "Voting already active");
        require(_projectIds.length > 0, "No projects selected");

        for (uint i = 0; i < _projectIds.length; i++) {
            require(projects[_projectIds[i]].isActive, "Project not active");
        }

        votingRounds[currentVotingRound] = VotingRound({
            projectIds: _projectIds,
            votingActive: true,
            resultsRevealed: false,
            startTime: block.timestamp,
            endTime: 0,
            voters: new address[](0),
            winningProjectId: 0,
            maxScore: 0
        });

        emit VotingRoundStarted(currentVotingRound, _projectIds, block.timestamp);
    }

    function submitVote(uint8 _projectId, uint8 _score) external onlyAuthorizedVoter onlyDuringVoting {
        require(_score >= 1 && _score <= 10, "Score must be between 1-10");
        require(_isProjectInCurrentRound(_projectId), "Project not in current round");
        require(!votes[currentVotingRound][_projectId][msg.sender].hasVoted, "Already voted for this project");

        euint8 encryptedScore = FHE.asEuint8(_score);

        votes[currentVotingRound][_projectId][msg.sender] = Vote({
            encryptedScore: encryptedScore,
            hasVoted: true,
            timestamp: block.timestamp
        });

        _addVoterToRound(msg.sender);

        FHE.allowThis(encryptedScore);
        FHE.allow(encryptedScore, msg.sender);

        emit VoteSubmitted(msg.sender, currentVotingRound, _projectId);
    }

    function endVotingRound() external onlyAdmin {
        require(votingRounds[currentVotingRound].votingActive, "Voting not active");
        require(!votingRounds[currentVotingRound].resultsRevealed, "Results already revealed");

        votingRounds[currentVotingRound].votingActive = false;
        votingRounds[currentVotingRound].endTime = block.timestamp;

        _requestResultsDecryption();
    }

    function _requestResultsDecryption() private {
        VotingRound storage round = votingRounds[currentVotingRound];

        // 收集所有需要解密的投票
        bytes32[] memory cts;
        uint256 totalVotes = 0;

        // 计算总投票数量
        for (uint i = 0; i < round.projectIds.length; i++) {
            uint8 projectId = round.projectIds[i];
            for (uint j = 0; j < round.voters.length; j++) {
                address voter = round.voters[j];
                if (votes[currentVotingRound][projectId][voter].hasVoted) {
                    totalVotes++;
                }
            }
        }

        cts = new bytes32[](totalVotes);
        uint256 index = 0;

        // 收集加密投票数据
        for (uint i = 0; i < round.projectIds.length; i++) {
            uint8 projectId = round.projectIds[i];
            for (uint j = 0; j < round.voters.length; j++) {
                address voter = round.voters[j];
                if (votes[currentVotingRound][projectId][voter].hasVoted) {
                    cts[index] = FHE.toBytes32(votes[currentVotingRound][projectId][voter].encryptedScore);
                    index++;
                }
            }
        }

        if (totalVotes > 0) {
            // 请求异步解密
            FHE.requestDecryption(cts, this.processResults.selector);
        } else {
            // 没有投票，直接完成
            _finalizeResults(0, 0);
        }
    }

    function processResults(
        uint256 requestId,
        uint8[] calldata decryptedScores,
        bytes[] calldata signatures
    ) external {
        // 注意：在实际部署时，应该验证调用者是否为可信的解密节点
        // 这里简化处理，假设解密结果是有效的

        VotingRound storage round = votingRounds[currentVotingRound];

        // 计算每个项目的得分
        uint8 winningProject = 0;
        uint8 maxTotalScore = 0;

        uint256 scoreIndex = 0;
        for (uint i = 0; i < round.projectIds.length; i++) {
            uint8 projectId = round.projectIds[i];
            uint8 projectScore = 0;

            for (uint j = 0; j < round.voters.length; j++) {
                address voter = round.voters[j];
                if (votes[currentVotingRound][projectId][voter].hasVoted) {
                    if (scoreIndex < decryptedScores.length) {
                        projectScore += decryptedScores[scoreIndex];
                        scoreIndex++;
                    }
                }
            }

            if (projectScore > maxTotalScore) {
                maxTotalScore = projectScore;
                winningProject = projectId;
            }
        }

        _finalizeResults(winningProject, maxTotalScore);
    }

    function _finalizeResults(uint8 _winningProject, uint8 _maxScore) private {
        VotingRound storage round = votingRounds[currentVotingRound];

        round.winningProjectId = _winningProject;
        round.maxScore = _maxScore;
        round.resultsRevealed = true;

        emit ResultsRevealed(currentVotingRound, _winningProject, _maxScore);

        currentVotingRound++;
    }

    function _isProjectInCurrentRound(uint8 _projectId) private view returns (bool) {
        VotingRound storage round = votingRounds[currentVotingRound];

        for (uint i = 0; i < round.projectIds.length; i++) {
            if (round.projectIds[i] == _projectId) {
                return true;
            }
        }
        return false;
    }

    function _addVoterToRound(address _voter) private {
        VotingRound storage round = votingRounds[currentVotingRound];

        for (uint i = 0; i < round.voters.length; i++) {
            if (round.voters[i] == _voter) {
                return;
            }
        }

        round.voters.push(_voter);
    }

    function getCurrentRoundInfo() external view returns (
        uint8 round,
        bool votingActive,
        bool resultsRevealed,
        uint256 startTime,
        uint256 endTime,
        uint8[] memory projectIds
    ) {
        VotingRound storage roundData = votingRounds[currentVotingRound];
        return (
            currentVotingRound,
            roundData.votingActive,
            roundData.resultsRevealed,
            roundData.startTime,
            roundData.endTime,
            roundData.projectIds
        );
    }

    function getProjectInfo(uint8 _projectId) external view returns (
        string memory name,
        string memory description,
        string memory category,
        address proposer,
        bool isActive,
        uint256 proposalTime
    ) {
        CulturalProject storage project = projects[_projectId];
        return (
            project.name,
            project.description,
            project.category,
            project.proposer,
            project.isActive,
            project.proposalTime
        );
    }

    function getVoteStatus(uint8 _projectId, address _voter) external view returns (
        bool hasVoted,
        uint256 timestamp
    ) {
        Vote storage vote = votes[currentVotingRound][_projectId][_voter];
        return (vote.hasVoted, vote.timestamp);
    }

    function getRoundResults(uint8 _round) external view returns (
        bool resultsRevealed,
        uint8 winningProjectId,
        uint8 maxScore,
        uint256 voterCount
    ) {
        VotingRound storage round = votingRounds[_round];
        return (
            round.resultsRevealed,
            round.winningProjectId,
            round.maxScore,
            round.voters.length
        );
    }

    function isAuthorizedVoter(address _voter) external view returns (bool) {
        return authorizedVoters[_voter];
    }

    // 获取项目的投票人数（不解密具体分数）
    function getProjectVoteCount(uint8 _projectId) external view returns (uint256) {
        VotingRound storage round = votingRounds[currentVotingRound];
        uint256 voteCount = 0;

        for (uint i = 0; i < round.voters.length; i++) {
            address voter = round.voters[i];
            if (votes[currentVotingRound][_projectId][voter].hasVoted) {
                voteCount++;
            }
        }

        return voteCount;
    }

    // 获取当前轮次的所有投票项目ID
    function getCurrentRoundProjectIds() external view returns (uint8[] memory) {
        return votingRounds[currentVotingRound].projectIds;
    }

    // 检查用户是否已对特定项目投票
    function hasUserVotedForProject(uint8 _projectId, address _voter) external view returns (bool) {
        return votes[currentVotingRound][_projectId][_voter].hasVoted;
    }
}
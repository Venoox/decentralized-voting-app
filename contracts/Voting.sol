pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract Voting {
    struct Answer {
        string answer;
        uint256 count;
    }
    struct Voter {
        bool registered;
        bool voted;
        uint256 voteTimestamp;
    }

    string public question;
    Answer[] public answers;

    uint256 public startTimestamp;
    uint256 public endTimestamp;

    mapping(address => Voter) voters;
    uint256 public votersCount;

    constructor(string memory _question, string[] memory _answers, address[] memory _voters, uint256 _startTimestamp, uint256 _endTimestamp) public {
        require(_answers.length <= 2**8, "Too many answers (max 256)");
        require(_voters.length <= 2**64, "Too many voters (max 2^64)");
        require(_startTimestamp < _endTimestamp, "Start time needs to be older than end time");
        question = _question;
        for (uint256 i = 0; i < _answers.length; i++) {
            answers.push(Answer(_answers[i], 0));
        }
        for (uint256 i = 0; i < _voters.length; i++) {
            voters[_voters[i]].registered = true;
        }
        votersCount = _voters.length;
        startTimestamp = _startTimestamp;
        endTimestamp = _endTimestamp;
    }

    function vote(uint256 index) public {
        /* Disabled due to Godwoken's issues
        require(startTimestamp <= block.timestamp, "Voting hasn't started");
        require(endTimestamp >= block.timestamp, "Voting has ended!");
        */
        require(index < answers.length, "No answer with that index");
        /* Disabled for testing
        require(voters[msg.sender].registered == true, "You need to be approved for voting!");
        require(voters[msg.sender].voted == false, "You already answered this question");
        */
        answers[index].count += 1;
        voters[msg.sender].voted = true;
    }

    function getAnswersCount() public view returns (uint256) {
        return answers.length;
    }

    function getAllAnswers() public view returns (Answer[] memory) {
        return answers;
    }

    function getVotedCount() public view returns (uint256 count) {
        for (uint256 i = 0; i < answers.length; i++) {
            count += answers[i].count;
        }
    }

    function getMostVoted() public view returns (Answer memory) {
        uint256 mostVotedIndex = 0;
        for (uint256 i = 1; i < answers.length; i++) {
            if (answers[i].count > answers[mostVotedIndex].count) {
                mostVotedIndex = i;
            }
        }
        return answers[mostVotedIndex];
    }
}
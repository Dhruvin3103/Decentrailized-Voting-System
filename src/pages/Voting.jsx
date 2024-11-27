import { useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  Search,
  FileText,
  Vote,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  TimerOff,
} from "lucide-react";

const Voting = ({
  voting,
  account,
  setLoading,
  getChoices,
  choices,
  getBallotDetails,
  ballot,
  visible,
  ended,
  getCurrentState,
  endVoting,
  totalVote,
  getTotalVotes,
  checkIsVoter,
  hasVoted,
  isVoter,
  state,
  getVoters,
  totalVoters,
  setContract,
  contract,
}) => {
  const doVote = async (val) => {
    setLoading(true);
    await voting.methods
      .doVote(val)
      .send({ from: account })
      .on("error", (error) => {
        toast.error(error.message);
      })
      .on("receipt", (receipt) => {
        toast.success("Vote casted successfully.");
        checkIsVoter();
        getTotalVotes();
      });
    setLoading(false);
  };

  useEffect(() => {
    if (ballot.name && contract) {
      getChoices();
      getTotalVotes();
      checkIsVoter();
      getCurrentState();
      getVoters();
    }
  }, [
    getChoices,
    getTotalVotes,
    checkIsVoter,
    getCurrentState,
    getVoters,
    ballot,
    contract,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-12">
          <Vote className="text-indigo-600" size={40} />
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Cast Your Vote
            </h1>
            <p className="text-gray-600 mt-2">Give your Vote Securely</p>
          </div>
        </div>

        {/* Ballot Details Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all hover:scale-[1.01]">
          <div className="flex items-center mb-6">
            <Search className="text-indigo-600 mr-4" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">
              Retrieve Election
            </h2>
          </div>
          <form onSubmit={getBallotDetails} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Election Address
              </label>
              <input
                type="text"
                value={contract}
                placeholder="Enter Election Address"
                onChange={(e) => setContract(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              />
            </div>

            {ballot.name && ballot.address && ballot.proposal && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FileText className="text-indigo-600 mr-2" size={20} />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Election Name
                    </h3>
                  </div>
                  <p className="text-gray-700">{ballot.name}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <ChevronRight className="text-purple-600 mr-2" size={20} />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Description
                    </h3>
                  </div>
                  <p className="text-gray-700">{ballot.proposal}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FileText className="text-indigo-600 mr-2" size={20} />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Address
                    </h3>
                  </div>
                  <p className="text-gray-700 break-all">{ballot.address}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] flex items-center justify-center"
            >
              <Search className="mr-2" /> Retrieve Election
            </button>
          </form>

          {/* Voting Status Messages */}
          {state === 0 && (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-center">
                <AlertTriangle className="text-amber-600 mr-3" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-amber-800">
                    Voting Not Started
                  </h3>

                  <p className="text-amber-700">
                    Please wait for the voting period to begin.
                  </p>
                </div>
              </div>
            </div>
          )}
          {state === 2 && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center">
                <CheckCircle2 className="text-blue-600 mr-3" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">
                    Voting Ended
                  </h3>
                  <p className="text-blue-700">
                    Please check the results by clicking below 
                  </p>
                  <Link
                    to="/result" 
                    className="text-blue-600 font-semibold mt-4 inline-block transition-all duration-200 ease-in-out transform hover:text-orange-600 hover:scale-105"
                  >
                    Check the Results
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Voting Section */}
        {visible && isVoter && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all hover:scale-[1.01]">
            <div className="flex items-center mb-6">
              <Vote className="text-green-600 mr-4" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">
                Cast Your Vote
              </h2>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
              <p className="text-lg text-green-800 flex items-center">
                {hasVoted ? (
                  <>
                    <CheckCircle2 className="mr-2 text-green-600" />
                    You've already cast your vote
                  </>
                ) : (
                  <>
                    <Vote className="mr-2 text-green-600" />
                    Select your choice below to cast your vote
                  </>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
              {choices?.map((val, ind) => (
                <button
                  key={ind}
                  className={`p-6 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2
                                        ${
                                          hasVoted
                                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                            : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                                        }`}
                  onClick={() => doVote(val)}
                  disabled={hasVoted}
                >
                  {hasVoted ? (
                    <XCircle className="mr-2" />
                  ) : (
                    <CheckCircle2 className="mr-2" />
                  )}
                  {val}
                </button>
              ))}
            </div>

            {totalVote !== 0 && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                <div className="flex items-center">
                  <Users className="text-indigo-600 mr-3" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-800">
                      Voting Progress
                    </h3>
                    <p className="text-indigo-700">
                      {totalVote} out of {totalVoters} voters have cast their
                      vote
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* End Voting Section */}
        {ballot.name && ballot.address === account && state === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-[1.01]">
            <div className="flex items-center mb-6">
              <TimerOff className="text-red-600 mr-4" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">End Voting</h2>
            </div>

            {totalVote !== 0 && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-6">
                <div className="flex items-center">
                  <Users className="text-indigo-600 mr-3" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-800">
                      Current Turnout
                    </h3>
                    <p className="text-indigo-700">
                      {totalVote} out of {totalVoters} voters have participated
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={endVoting}
              disabled={ended}
              className={`w-full p-4 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center
                                ${
                                  ended
                                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700"
                                }`}
            >
              <TimerOff className="mr-2" /> End Voting Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Voting;

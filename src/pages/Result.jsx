import { useEffect, useState } from "react";
import { 
    BarChart3, 
    Search, 
    FileText, 
    ChevronRight,
    Trophy,
    AlertCircle
} from "lucide-react";

const Result = ({
    voting,
    setLoading,
    getBallotDetails,
    state,
    ballot,
    choices,
    getChoices,
    getCurrentState,
    contract,
    setContract,
}) => {
    const [result, setResult] = useState([]);

    const getResult = async (choice) => {
        const vote = await voting.methods.getVote(choice).call();
        return parseInt(vote);
    };

    const getAllResult = async () => {
        setLoading(true);
        let votes = [];
        for (let i = 0; i < choices.length; i++) {
            const ele = choices[i];
            const res = await getResult(ele);
            votes.push({ name: ele, vote: res });
        }
        setResult(votes);
        setLoading(false);
    };

    useEffect(() => {
        if (contract && ballot.address) {
            getChoices();
            getCurrentState();
        }
    }, [getChoices, ballot, contract, getCurrentState]);

    // Find the winner(s)
    const winners = result.length > 0 
        ? result.filter(item => item.vote === Math.max(...result.map(r => r.vote)))
        : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center space-x-4 mb-12">
                    <BarChart3 className="text-indigo-600" size={40} />
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            Election Results
                        </h1>
                        <p className="text-gray-600 mt-2">View and analyze voting outcomes</p>
                    </div>
                </div>

                {/* Get Election Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all hover:scale-[1.01]">
                    <div className="flex items-center mb-6">
                        <Search className="text-indigo-600 mr-4" size={28} />
                        <h2 className="text-2xl font-bold text-gray-800">Retrieve Election</h2>
                    </div>
                    <form onSubmit={getBallotDetails} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Election Address</label>
                            <input
                                type="text"
                                value={contract}
                                name="name"
                                placeholder="Enter Ballot Address"
                                onChange={(e) => setContract(e.target.value)}
                                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                            />
                        </div>

                        {ballot.name && ballot.address && ballot.proposal && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <FileText className="text-indigo-600 mr-2" size={20} />
                                        <h3 className="text-lg font-semibold text-gray-800">Election Name</h3>
                                    </div>
                                    <p className="text-gray-700">{ballot.name}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <ChevronRight className="text-purple-600 mr-2" size={20} />
                                        <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                                    </div>
                                    <p className="text-gray-700">{ballot.proposal}</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <FileText className="text-indigo-600 mr-2" size={20} />
                                        <h3 className="text-lg font-semibold text-gray-800">Address</h3>
                                    </div>
                                    <p className="text-gray-700 break-all">{ballot.address}</p>
                                </div>
                            </div>
                        )}

                        {state === 1 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                                <div className="flex items-center">
                                    <AlertCircle className="text-amber-600 mr-3" size={24} />
                                    <div>
                                        <h3 className="text-lg font-semibold text-amber-800">Voting in Progress</h3>
                                        <p className="text-amber-700">Results will be available once voting has concluded.</p>
                                    </div>
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
                </div>

                {/* Results Section */}
                {state === 2 && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-[1.01]">
                        <div className="flex items-center mb-6">
                            <Trophy className="text-amber-600 mr-4" size={28} />
                            <h2 className="text-2xl font-bold text-gray-800">Final Results</h2>
                        </div>

                        <button
                            onClick={getAllResult}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] flex items-center justify-center mb-8"
                        >
                            <BarChart3 className="mr-2" /> View Results
                        </button>

                        {result?.length > 0 && (
                            <div className="space-y-6">
                                {/* Winners Section */}
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                                    <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center">
                                        <Trophy className="mr-2" size={24} />
                                        {winners.length === 1 ? 'Winner' : 'Tied Winners'}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {winners.map((winner, index) => (
                                            <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                                                <h4 className="font-semibold text-amber-900">{winner.name}</h4>
                                                <p className="text-2xl font-bold text-amber-600">{winner.vote} votes</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* All Results */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {result.map((val, ind) => (
                                        <div
                                            key={ind}
                                            className={`p-6 rounded-xl shadow-md transform transition-all hover:scale-[1.02] ${
                                                winners.some(w => w.name === val.name)
                                                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
                                                    : 'bg-white'
                                            }`}
                                        >
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{val.name}</h3>
                                            <div className="flex items-center justify-between">
                                                <span className="text-3xl font-bold text-indigo-600">{val.vote}</span>
                                                <span className="text-gray-600">votes</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Result;
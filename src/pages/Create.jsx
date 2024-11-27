import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { 
    PlusCircle,
    CheckCircle, 
    Users,
    FileText,
    Vote,
    ChevronRight
} from "lucide-react";

import { BYTE_CODE } from "../data/Data";

const VotingSystem = ({
    account,
    setLoading,
    contract,
    setContract,
    getChoices,
    choices,
    disable,
    setDisable,
    startVoting,
    totalVoters,
    getVoters,
    getCurrentState,
    state,
    getBallotDetails,
    ballot,
    setIsAlreadyCreated,
    isAlreadyCreated,
    setBallot,
    voting,
}) => {
    const [choice, setChoice] = useState("");
    const [voter, setVoter] = useState({
        name: "",
        address: "",
    });

    const onCreateBallot = async (e) => {
        e.preventDefault();
        setLoading(true);

        await voting
            .deploy({
                data: BYTE_CODE.object,
                arguments: [ballot.name, ballot.proposal],
            })
            .send({ from: account })
            .on("error", (error) => {
                toast.error(error.message);
                setLoading(false);
            })
            .on("receipt", (receipt) => {
                toast.success("Contract deployed successfully.");
                localStorage.setItem("CONTRACT", receipt.contractAddress);
                setContract(receipt.contractAddress);
                setIsAlreadyCreated(true);
            });
        setLoading(false);
    };

    const onAddChoice = async (e) => {
        e.preventDefault();
        setLoading(true);

        await voting.methods
            .addChoice(choice)
            .send({ from: account })
            .on("error", (error) => {
                toast.error(error.message);
                setLoading(false);
            })
            .on("receipt", (_) => {
                toast.success("Choice Added");
                setChoice("");
                getChoices();
            });
        setLoading(false);
    };

    const onAddVoter = async (e) => {
        e.preventDefault();
        setLoading(true);

        await voting.methods
            .addVoter(voter.address, voter.name)
            .send({ from: account })
            .on("error", (error) => {
                toast.error(error.message);
                setLoading(false);
            })
            .on("receipt", () => {
                toast.success("Voter Added");
                setVoter({ name: "", address: "" });
                getVoters();
            });
        setLoading(false);
    };

    useEffect(() => {
        if (contract && voting?._address) {
            getBallotDetails();
            getChoices();
            getVoters();
            getCurrentState();
        }
        setDisable(state === 1);
    }, [contract, state, voting?._address, setDisable, getBallotDetails, getChoices, getVoters, getCurrentState]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <Vote className="h-12 w-12 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl h-auto font-extrabold text-transparent bg-clip-text bg-gradient-to-r pb-5 from-indigo-600 to-purple-600 mb-4">
                        Decentralized Voting System
                    </h1>
                    <p className="text-lg text-gray-600">Secure, transparent, and efficient voting platform</p>
                </div>

                {/* Create Ballot Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 transition-all duration-300 hover:shadow-2xl">
                    <div className="px-6 py-8">
                        <div className="flex items-center mb-6">
                            <FileText className="h-8 w-8 text-indigo-600 mr-3" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Create Election</h2>
                                <p className="text-gray-600">Set up your voting Election</p>
                            </div>
                        </div>
                        <form onSubmit={onCreateBallot} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Election Name</label>
                                <input
                                    type="text"
                                    value={ballot.name}
                                    onChange={(e) => setBallot({ ...ballot, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                    placeholder="Enter Election name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripion</label>
                                <input
                                    type="text"
                                    value={ballot.proposal}
                                    onChange={(e) => setBallot({ ...ballot, proposal: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                    placeholder="Describe your Descripion"
                                />
                            </div>
                            {localStorage.getItem("CONTRACT") && (
                                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-sm text-indigo-700">
                                    Contract Address: {localStorage.getItem("CONTRACT")}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
                            >
                                <PlusCircle className="mr-2 h-5 w-5" /> Create Election
                            </button>
                        </form>
                    </div>
                </div>

                {isAlreadyCreated && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Choices Section */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                            <div className="px-6 py-8">
                                <div className="flex items-center mb-6">
                                    <FileText className="h-8 w-8 text-green-600 mr-3" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Add Choices</h2>
                                        <p className="text-gray-600">Define voting options</p>
                                    </div>
                                </div>
                                <form onSubmit={onAddChoice} className="flex gap-3 mb-6">
                                    <input
                                        type="text"
                                        value={choice}
                                        onChange={(e) => setChoice(e.target.value)}
                                        placeholder="Enter Choice"
                                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        disabled={disable || state === 1}
                                    />
                                    <button
                                        type="submit"
                                        disabled={disable || state === 1}
                                        className="bg-green-600 text-white px-6 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add
                                    </button>
                                </form>
                                <div className="max-h-[240px] overflow-y-auto space-y-3">
                                    {choices.map((choice, index) => (
                                        <div 
                                            key={index}
                                            className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 flex items-center"
                                        >
                                            <ChevronRight className="h-5 w-5 text-green-600 mr-2" />
                                            <span className="text-green-800">{choice}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Voters Section */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                            <div className="px-6 py-8">
                                <div className="flex items-center mb-6">
                                    <Users className="h-8 w-8 text-purple-600 mr-3" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Add Voters</h2>
                                        <p className="text-gray-600">Manage voter registration</p>
                                    </div>
                                </div>
                                <form onSubmit={onAddVoter} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Voter Address</label>
                                        <input
                                            type="text"
                                            value={voter.address}
                                            onChange={(e) => setVoter({ ...voter, address: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                            disabled={disable || state === 1}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Voter Name</label>
                                        <input
                                            type="text"
                                            value={voter.name}
                                            onChange={(e) => setVoter({ ...voter, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                            disabled={disable || state === 1}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={disable || state === 1}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        <PlusCircle className="mr-2 h-5 w-5" /> Add Voter
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {isAlreadyCreated && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 transition-all duration-300 hover:shadow-2xl">
                        <div className="px-6 py-6">
                            <button
                                onClick={startVoting}
                                disabled={totalVoters === 0 || disable || state === 1 || choices.length === 0}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <CheckCircle className="mr-2 h-6 w-6" /> Start Voting
                            </button>
                        </div>
                    </div>
                )}

                {disable && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                            <span className="text-green-800 font-medium">Voting has started!</span>
                        </div>
                        <NavLink
                            to="/voting"
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-200"
                        >
                            Go to Voting Page
                        </NavLink>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VotingSystem;
import { useState } from "react";
import { AlertCircle, CheckCircle, AlertTriangle, Zap } from "lucide-react";

function OutputPanel({ output, analysis, isAnalyzing }) {
  const [activeTab, setActiveTab] = useState("output");

  const renderComplexityBadge = (rating) => {
    const badgeClass = {
      optimized: "badge badge-success",
      average: "badge badge-warning",
      suboptimal: "badge badge-error",
    };
    return badgeClass[rating] || "badge";
  };

  const renderIssueBadge = (type) => {
    const badgeClass = {
      error: "badge badge-error",
      warning: "badge badge-warning",
      suggestion: "badge badge-info",
    };
    return badgeClass[type] || "badge";
  };

  return (
    <div className="h-full bg-base-100 flex flex-col">
      {/* Tab Navigation */}
      <div className="px-4 py-2 bg-base-200 border-b border-base-300 flex gap-2">
        <button
          className={`tab tab-sm ${activeTab === "output" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("output")}
        >
          Output
        </button>
        <button
          className={`tab tab-sm ${activeTab === "analysis" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("analysis")}
          disabled={!analysis || isAnalyzing}
        >
          AI Analysis {isAnalyzing && <span className="loading loading-spinner loading-xs ml-2"></span>}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4">
        {/* Output Tab */}
        {activeTab === "output" && (
          <>
            {output === null ? (
              <p className="text-base-content/50 text-sm">
                Click "Run Code" to see the output here...
              </p>
            ) : output.success ? (
              <pre className="text-sm font-mono text-success whitespace-pre-wrap">
                {output.output}
              </pre>
            ) : (
              <div>
                {output.output && (
                  <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-2">
                    {output.output}
                  </pre>
                )}
                <pre className="text-sm font-mono text-error whitespace-pre-wrap">
                  {output.error}
                </pre>
              </div>
            )}
          </>
        )}

        {/* Analysis Tab */}
        {activeTab === "analysis" && (
          <>
            {isAnalyzing ? (
              <div className="flex items-center justify-center h-full">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="ml-3">Analyzing your code with AI...</p>
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                {/* Correctness Section */}
                <div className="card bg-base-200">
                  <div className="card-body py-3 px-4">
                    <h3 className="card-title text-sm flex items-center gap-2">
                      {analysis.analysis?.correctness?.isCorrect ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-success" />
                          Correctness: Passed
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-error" />
                          Correctness: Issues Found
                        </>
                      )}
                    </h3>

                    {analysis.analysis?.correctness?.issues &&
                      analysis.analysis.correctness.issues.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {analysis.analysis.correctness.issues.map((issue, idx) => (
                            <div key={idx} className="flex gap-2">
                              <span className={`${renderIssueBadge(issue.type)} text-xs`}>
                                {issue.type}
                              </span>
                              <p className="text-xs text-base-content">
                                {issue.line && `Line ${issue.line}: `}
                                {issue.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>

                {/* Complexity Section */}
                {analysis.analysis?.complexity && (
                  <div className="card bg-base-200">
                    <div className="card-body py-3 px-4">
                      <h3 className="card-title text-sm flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Complexity Analysis
                      </h3>
                      <div className="space-y-2 mt-2">
                        <div>
                          <p className="text-xs font-semibold">Time Complexity</p>
                          <p className="text-xs text-base-content">
                            {analysis.analysis.complexity.timeComplexity}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold">Space Complexity</p>
                          <p className="text-xs text-base-content">
                            {analysis.analysis.complexity.spaceComplexity}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center mt-2">
                          <span className={`${renderComplexityBadge(analysis.analysis.complexity.rating)}`}>
                            {analysis.analysis.complexity.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback Section */}
                {analysis.analysis?.feedback && (
                  <div className="card bg-base-200">
                    <div className="card-body py-3 px-4">
                      <h3 className="card-title text-sm">Feedback & Suggestions</h3>

                      {analysis.analysis.feedback.strengths &&
                        analysis.analysis.feedback.strengths.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-success mb-1">Strengths:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {analysis.analysis.feedback.strengths.map((strength, idx) => (
                                <li key={idx} className="text-xs text-base-content">
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {analysis.analysis.feedback.areasForImprovement &&
                        analysis.analysis.feedback.areasForImprovement.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-warning mb-1">
                              Areas for Improvement:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              {analysis.analysis.feedback.areasForImprovement.map((area, idx) => (
                                <li key={idx} className="text-xs text-base-content">
                                  {area}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {analysis.analysis.feedback.overallAssessment && (
                        <div className="mt-3 p-2 bg-base-100 rounded">
                          <p className="text-xs">
                            <span className="font-semibold">Overall: </span>
                            {analysis.analysis.feedback.overallAssessment}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Improvements Section */}
                {analysis.analysis?.improvements &&
                  analysis.analysis.improvements.length > 0 && (
                    <div className="card bg-base-200">
                      <div className="card-body py-3 px-4">
                        <h3 className="card-title text-sm">Suggested Improvements</h3>
                        <div className="space-y-3 mt-2">
                          {analysis.analysis.improvements.map((improvement, idx) => (
                            <div key={idx} className="border-l-4 border-primary pl-3">
                              <p className="text-xs font-semibold capitalize">
                                {improvement.category}
                              </p>
                              <p className="text-xs text-base-content mt-1">
                                {improvement.description}
                              </p>
                              {improvement.example && (
                                <pre className="text-xs bg-base-300 p-2 rounded mt-1 overflow-x-auto">
                                  {improvement.example}
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <p className="text-base-content/50 text-sm">
                Run your code to get AI analysis and suggestions...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;

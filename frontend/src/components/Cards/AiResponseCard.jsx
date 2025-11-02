import React from 'react'
import ReactMarkdown from 'react-markdown';

function AiResponseCard({ text }) {
    return (
        <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            <ReactMarkdown
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <div className="my-2 sm:my-4 rounded-md overflow-hidden bg-gray-50 border border-gray-200">
                                <div className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-100 border-b border-gray-200 text-[10px] sm:text-xs text-gray-600 font-mono">
                                    {match[1]}
                                </div>
                                <pre className="p-2 sm:p-4 overflow-x-auto text-xs sm:text-sm">
                                    <code className={`language-${match[1]}`} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            </div>
                        ) : (
                            <code className="bg-gray-100 rounded px-1 sm:px-1.5 py-0.5 text-xs sm:text-sm font-mono">
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {text}
            </ReactMarkdown>
        </div>
    )
}

export default AiResponseCard
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SkillRoadmapModal from '../components/SkillRoadmapModal';
import './ResultsPage.css';

function ResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        suggested_roles = [],
        skills_found = { technical: [], soft: [] },
        missing_skills = [],
        career_advice = '',
        resumeName = 'DefaultResume'
    } = location.state || {};

    const suggestions = suggested_roles.map(role => role.title);
    const skills = skills_found.technical;

    const [selectedSkill, setSelectedSkill] = useState(null);

    return (
        <div className="results-container p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">📊 AI Career Insights</h2>

            {/* Career Advice */}
            <div className="section-block mb-8">
                <h3 className="text-xl font-semibold mb-2">🧠 Career Advice</h3>
                <p className="text-gray-700">{career_advice || "No career advice provided."}</p>
            </div>

            {/* Recommended Roles */}
            <div className="job-recommendation-section mb-8">
                <h3 className="text-xl font-semibold mb-2">💼 Recommended Job Roles</h3>
                {suggested_roles.length > 0 ? (
                    <ul className="list-disc ml-6 space-y-1">
                        {suggested_roles.map((role, index) => (
                            <li key={index}>
                                <strong>{role.title}</strong> — <em>{role.reason}</em>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-red-500">No job suggestions available.</p>
                )}
            </div>

            {/* Skills Found */}
            <div className="section-block mb-8">
                <h3 className="text-xl font-semibold mb-2">✅ Skills Found</h3>
                <p><strong>Technical:</strong> {skills_found.technical.length > 0 ? skills_found.technical.join(', ') : 'None detected'}</p>
                <p><strong>Soft:</strong> {skills_found.soft.length > 0 ? skills_found.soft.join(', ') : 'None detected'}</p>
            </div>

            {/* Missing Skills */}
            <div className="section-block">
                <h3 className="text-xl font-semibold mb-2">🚧 Suggested Skills to Improve</h3>
                {missing_skills.length > 0 ? (
                    <div className="missing-skills-grid">
                        {missing_skills.map((skill, index) => (
                            <div
                                key={index}
                                className="skill-card"
                                onClick={() => setSelectedSkill(skill)}
                            >
                                {skill}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No missing skills detected.</p>
                )}
            </div>

            {/* View Jobs Button */}
            <div className="job-button-wrapper">
                <button
                    className="view-jobs-button"
                    onClick={() =>
                        navigate('/jobs', {
                            state: { suggestions, skills, resumeName },
                        })
                    }
                >
                    🔎 View Available Jobs
                </button>
            </div>

            {/* Skill Roadmap Modal */}
            {selectedSkill && (
                <SkillRoadmapModal
                    skill={selectedSkill}
                    onClose={() => setSelectedSkill(null)}
                />
            )}
        </div>
    );
}

export default ResultsPage;

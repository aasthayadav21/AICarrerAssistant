import React, { useEffect, useState } from 'react';
import './SkillRoadmapModal.css';

function normalize(text) {
  return text.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s+/g, '').trim();
}

function SkillRoadmapModal({ skill, onClose }) {
  const [roadmap, setRoadmap] = useState([]);
  const [title, setTitle] = useState(skill);

  useEffect(() => {
    async function fetchRoadmaps() {
      try {
        const res = await fetch('/roadmaps.json'); // ✅ loads from public/
        const data = await res.json();

        const normalized = normalize(skill);
        const matchedKey = Object.keys(data).find(key =>
          normalize(key).includes(normalized)
        );

        if (matchedKey) {
          setRoadmap(data[matchedKey]);
          setTitle(matchedKey);
        } else {
          setRoadmap(['❌ Roadmap not available yet.']);
        }
      } catch (err) {
        console.error('Error loading roadmap:', err);
        setRoadmap(['❌ Failed to load roadmap']);
      }
    }

    fetchRoadmaps();
  }, [skill]);

  return (
    <div className="skill-modal-overlay">
      <div className="skill-modal-content">
        <button onClick={onClose} className="skill-modal-close">×</button>
        <h2>📚 Roadmap for {title}</h2>
        <ul className="roadmap-list">
          {roadmap.map((step, index) => <li key={index}>{step}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default SkillRoadmapModal;

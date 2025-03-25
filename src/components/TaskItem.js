import React, { useState } from 'react';

const TaskItem = ({ task, categories, onComplete, onDelete, onCategoryClick }) => {
    const [expanded, setExpanded] = useState(false);
    const displayCategories = expanded ? categories : categories.slice(0, 2);

    return (
        <div className={`task-item ${task.statut ? 'completed' : ''} ${task.urgent ? 'urgent' : ''}`}>
            <div className="task-checkbox">
                <input
                    type="checkbox"
                    checked={task.statut}
                    onChange={onComplete}
                />
            </div>

            <div className="task-content">
                <div className="task-header">
                    <h3>{task.intitule}</h3>
                    <span
                        className="expand-toggle"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? '▼' : '▶'}
                    </span>
                </div>

                {task.dateEcheance && (
                    <div className="task-date">
                        Échéance: {new Date(task.dateEcheance).toLocaleDateString()}
                    </div>
                )}

                <div className="task-categories">
                    {displayCategories.map(category => (
                        <span
                            key={category.id}
                            className="category-tag"
                            style={{ backgroundColor: category.couleur }}
                            onClick={() => onCategoryClick(category.id)}
                        >
                            {category.intitule}
                        </span>
                    ))}
                </div>

                {expanded && task.description && (
                    <div className="task-description">
                        {task.description}
                    </div>
                )}
            </div>

            <button className="delete-button" onClick={onDelete}>✖</button>
        </div>
    );
};

export default TaskItem;
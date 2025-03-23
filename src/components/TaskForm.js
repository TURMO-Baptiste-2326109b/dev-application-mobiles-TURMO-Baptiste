import React, { useState } from 'react';

const TaskForm = ({ categories, onSubmit, onCancel }) => {
    const [task, setTask] = useState({
        intitule: '',
        description: '',
        dateEcheance: '',
        urgent: false,
        contacts: [],
        categories: []
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTask({
            ...task,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleCategoryToggle = (categoryId) => {
        const updatedCategories = task.categories.includes(categoryId)
            ? task.categories.filter(id => id !== categoryId)
            : [...task.categories, categoryId];

        setTask({
            ...task,
            categories: updatedCategories
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (task.intitule.length < 5) {
            setError("L'intitulé doit contenir au moins 5 caractères");
            return;
        }

        onSubmit(task);
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <h2>Nouvelle tâche</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
                <label>Intitulé (min. 5 caractères) *</label>
                <input
                    type="text"
                    name="intitule"
                    value={task.intitule}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="form-group">
                <label>Date d'échéance</label>
                <input
                    type="date"
                    name="dateEcheance"
                    value={task.dateEcheance}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>
                    <input
                        type="checkbox"
                        name="urgent"
                        checked={task.urgent}
                        onChange={handleChange}
                    />
                    Urgent
                </label>
            </div>

            <div className="form-group">
                <label>Catégories</label>
                <div className="categories-list">
                    {categories.map(category => (
                        <div key={category.id} className="category-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={task.categories.includes(category.id)}
                                    onChange={() => handleCategoryToggle(category.id)}
                                />
                                {category.intitule}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel}>Annuler</button>
                <button type="submit">Ajouter</button>
            </div>
        </form>
    );
};

export default TaskForm;
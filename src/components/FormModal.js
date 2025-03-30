import React, { useState } from 'react';
import { CATEGORY_COLORS } from '../config/DefaultConfig';

const FormModal = ({ isOpen, type, categories, onSubmit, onCancel }) => {
    const isTaskForm = type === 'task';

    const [task, setTask] = useState({
        intitule: '',
        description: '',
        dateEcheance: '',
        urgent: false,
        contacts: [],
        categories: []
    });

    const [category, setCategory] = useState({
        intitule: '',
        description: '',
        couleur: CATEGORY_COLORS[0],
        pictogramme: '📝'
    });

    const [error, setError] = useState('');

    const handleTaskChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTask({
            ...task,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategory({
            ...category,
            [name]: value
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

    const handleColorSelect = (color) => {
        setCategory({
            ...category,
            couleur: color
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isTaskForm) {
            if (task.intitule.length < 5) {
                setError("L'intitulé doit contenir au moins 5 caractères");
                return;
            }
            onSubmit(task);
        } else {
            if (category.intitule.length < 3) {
                setError("L'intitulé doit contenir au moins 3 caractères");
                return;
            }
            onSubmit(category);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <form onSubmit={handleSubmit} className={isTaskForm ? "task-form" : "category-form"}>
                    <h2>{isTaskForm ? "Nouvelle tâche" : "Nouvelle catégorie"}</h2>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>Intitulé (min. {isTaskForm ? "5" : "3"} caractères) *</label>
                        <input
                            type="text"
                            name="intitule"
                            value={isTaskForm ? task.intitule : category.intitule}
                            onChange={isTaskForm ? handleTaskChange : handleCategoryChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={isTaskForm ? task.description : category.description}
                            onChange={isTaskForm ? handleTaskChange : handleCategoryChange}
                        ></textarea>
                    </div>

                    {isTaskForm ? (
                        <>
                            <div className="form-group">
                                <label>Date d'échéance</label>
                                <input
                                    type="date"
                                    name="dateEcheance"
                                    value={task.dateEcheance}
                                    onChange={handleTaskChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="urgent"
                                        checked={task.urgent}
                                        onChange={handleTaskChange}
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
                        </>
                    ) : (
                        <div className="form-group">
                            <label>Couleur</label>
                            <div className="color-selector">
                                {CATEGORY_COLORS.map(color => (
                                    <div
                                        key={color}
                                        className={`color-option ${category.couleur === color ? 'selected' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleColorSelect(color)}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" onClick={onCancel}>Annuler</button>
                        <button type="submit">Ajouter</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormModal;
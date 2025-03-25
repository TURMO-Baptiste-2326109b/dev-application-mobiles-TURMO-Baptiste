import React, { useState } from 'react';

const COLORS = [
    '#FF5733', '#33FF57', '#3357FF', '#F333FF',
    '#FF33F3', '#33FFF3', '#FFF333', '#FF8C33',
    '#8C33FF', '#33FFBE'
];

const CategoryForm = ({ onSubmit, onCancel }) => {
    const [category, setCategory] = useState({
        intitule: '',
        description: '',
        couleur: COLORS[0],
        pictogramme: '📝'
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({
            ...category,
            [name]: value
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

        if (category.intitule.length < 3) {
            setError("L'intitulé doit contenir au moins 3 caractères");
            return;
        }

        onSubmit(category);
    };

    return (
        <form onSubmit={handleSubmit} className="category-form">
            <h2>Nouvelle catégorie</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
                <label>Intitulé (min. 3 caractères) *</label>
                <input
                    type="text"
                    name="intitule"
                    value={category.intitule}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    value={category.description}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="form-group">
                <label>Couleur</label>
                <div className="color-selector">
                    {COLORS.map(color => (
                        <div
                            key={color}
                            className={`color-option ${category.couleur === color ? 'selected' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorSelect(color)}
                        ></div>
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

export default CategoryForm;
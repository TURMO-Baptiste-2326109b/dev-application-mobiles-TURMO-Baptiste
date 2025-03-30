import React from 'react';

const Header = ({ onReset, onImport, fileInputRef }) => {
    return (
        <nav className="navbar">
            <h1>Todo List</h1>
            <div>
                <button className="up-button" onClick={onReset}>Remise à zéro</button>
                <button
                    className="up-button"
                    onClick={() => fileInputRef.current.click()}
                >
                    Charger backup
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    style={{display: 'none'}}
                    onChange={onImport}
                />
            </div>
        </nav>
    );
};

export default Header;
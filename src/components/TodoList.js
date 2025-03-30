import React from 'react';
import TaskItem from './TaskItem';
import Filter from './Filter';

const TodoList = ({ tasks, categories, onCompleteTask, onDeleteTask }) => {
    const [filteredTasks, setFilteredTasks] = React.useState([]);

    return (
        <div className="task-list">
            <Filter
                tasks={tasks}
                onFilterChange={setFilteredTasks}
            />

            <div className="tasks-container">
                {filteredTasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        categories={categories.filter(c => task.categories.includes(c.id))}
                        onComplete={() => onCompleteTask(task.id)}
                        onDelete={() => onDeleteTask(task.id)}
                        onCategoryClick={() => {}}
                    />
                ))}
            </div>
        </div>
    );
};

export default TodoList;
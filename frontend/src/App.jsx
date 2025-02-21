import React from 'react';
import ErrorBoundary from './components/ErrorBoundary'; // Adjust the path as necessary
import ProjectList from './components/ProjectList'; // Adjust the path as necessary
import './App.css'

const App = () => {
    return (
        <div>
            <ErrorBoundary>
                <ProjectList />
            </ErrorBoundary>
        </div>
    );
};

export default App;
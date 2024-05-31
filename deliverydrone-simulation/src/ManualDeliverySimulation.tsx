import React, { useState, useEffect } from 'react';
import './App.css';

const ManualDeliverySimulation: React.FC = () => {
    const [merchandisers, setMerchandisers] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [selectedMerchandiser, setSelectedMerchandiser] = useState<string>('');
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [simulationMessages, setSimulationMessages] = useState<string[]>([]);

    useEffect(() => {
        fetchMerchandisers();
        fetchClients();
    }, []);

    const fetchMerchandisers = async () => {
        try {
            const response = await fetch('http://localhost:9876/api/merchandisers');
            const data = await response.json();
            setMerchandisers(data);
        } catch (error) {
            console.error('Error fetching merchandisers:', error);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await fetch('http://localhost:9876/api/clients');
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleMerchandiserChange = (merchandiserId: string) => {
        setSelectedMerchandiser(merchandiserId);
    };

    const handleClientChange = (clientId: string) => {
        setSelectedClient(clientId);
    };

    const simulateDelivery = async () => {
        if (!selectedMerchandiser || !selectedClient) {
            setErrorMessage('Please select a merchandiser and a client.');
            return;
        }

        setErrorMessage('');

        const clientUuid = selectedClient;
        const merchandiserUuid = selectedMerchandiser;

        const url = `http://localhost:9876/api/manual-delivery/simulate?clientUuid=${clientUuid}&merchandiserUuid=${merchandiserUuid}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // No body parameters
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSimulationMessages(data.messages);
            } else {
                console.error('Failed to trigger delivery simulation.');
            }
        } catch (error) {
            console.error('Error triggering delivery simulation:', error);
        }
    };

    return (
        <div className="container">
            <header>
                <img src="/logo.png" alt="DeliDrone Logo" className="logo"/>
                <h1 className="title">DeliDrone</h1>
            </header>
            <div className="content">
                <div className="column">
                    <h2>List of Clients</h2>
                    <ul className="list">
                        {clients.map((client) => (
                            <li key={client.id}>
                                <label>
                                    <input
                                        type="radio"
                                        name="client"
                                        value={client.id}
                                        checked={selectedClient === client.id}
                                        onChange={() => handleClientChange(client.id)}
                                    />
                                    {client.name} - {client.address}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="column">
                    <h2>List of Merchandisers</h2>
                    <ul className="list">
                        {merchandisers.map((merchandiser) => (
                            <li key={merchandiser.id}>
                                <label>
                                    <input
                                        type="radio"
                                        name="merchandiser"
                                        value={merchandiser.id}
                                        checked={selectedMerchandiser === merchandiser.id}
                                        onChange={() => handleMerchandiserChange(merchandiser.id)}
                                    />
                                    {merchandiser.name} - {merchandiser.address}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button onClick={simulateDelivery} className="simulation-button">Start Order Simulation</button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="simulation-result">
                <h2>Simulation Result</h2>
                <ul>
                    {simulationMessages.map((message, index) => (
                        <li key={index}>{message}</li>
                    ))}
                </ul>
            </div>
            <footer className="footer">
                <p>&copy; 2024 DeliDrone. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ManualDeliverySimulation;

import React, { useState } from 'react';

function CreateGame({ onCreateGame }) {
  const [formData, setFormData] = useState({
    minPlayers: 3,
    entryFee: 0.01,
    serviceFeePercent: 5,
    registrationPeriod: 3600, // 1 hour in seconds
    submissionPeriod: 3600 // 1 hour in seconds
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'entryFee' ? parseFloat(value) : parseInt(value)
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateGame(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="minPlayers" className="form-label">Minimum Players</label>
        <input
          type="number"
          className="form-control"
          id="minPlayers"
          name="minPlayers"
          min="3"
          value={formData.minPlayers}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="entryFee" className="form-label">Entry Fee (ETH)</label>
        <input
          type="number"
          className="form-control"
          id="entryFee"
          name="entryFee"
          min="0.0001"
          step="0.001"
          value={formData.entryFee}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="serviceFeePercent" className="form-label">Service Fee (%)</label>
        <input
          type="number"
          className="form-control"
          id="serviceFeePercent"
          name="serviceFeePercent"
          min="1"
          max="20"
          value={formData.serviceFeePercent}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="registrationPeriod" className="form-label">Registration Period (seconds)</label>
        <input
          type="number"
          className="form-control"
          id="registrationPeriod"
          name="registrationPeriod"
          min="300"
          value={formData.registrationPeriod}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="submissionPeriod" className="form-label">Submission Period (seconds)</label>
        <input
          type="number"
          className="form-control"
          id="submissionPeriod"
          name="submissionPeriod"
          min="300"
          value={formData.submissionPeriod}
          onChange={handleChange}
          required
        />
      </div>
      
      <button type="submit" className="btn btn-primary w-100">Create Game</button>
    </form>
  );
}

export default CreateGame;
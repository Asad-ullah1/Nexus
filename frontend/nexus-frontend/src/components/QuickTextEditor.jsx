// src/components/QuickTextEditor.jsx
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const QuickTextEditor = ({ insightId, currentText, onUpdate, onCancel, loading = false }) => {
  const [text, setText] = useState(currentText || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('Text cannot be empty');
      return;
    }

    try {
      await onUpdate(insightId, text.trim());
      onCancel(); // Close the editor after successful update
    } catch (err) {
      setError('Failed to update text. Please try again.');
    }
  };

  return (
    <div className="mt-2">
      {error && (
        <Alert variant="danger" className="mb-2">
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Control
            as="textarea"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Update insight text..."
            disabled={loading}
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="primary" size="sm" type="submit" disabled={loading || !text.trim()}>
            {loading ? 'Updating...' : 'Update Text'}
          </Button>
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default QuickTextEditor;

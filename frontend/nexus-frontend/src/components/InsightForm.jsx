import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import api from '../lib/api';

const InsightForm = ({ initialData, onSaved, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.summary || initialData?.description || '',
      tags: initialData?.tags ? initialData.tags.join(', ') : '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError('');

    try {
      // Process tags - split by comma and trim whitespace
      const processedData = {
        title: data.title,
        summary: data.description, // Map description to summary for backend
        tags: data.tags
          ? data.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
      };

      let response;
      if (initialData) {
        // Update existing insight
        response = await api.patch(`/insights/${initialData.id}`, processedData);
      } else {
        // Create new insight
        response = await api.post('/insights', processedData);
      }

      onSaved(response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to save insight. Please try again.';
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {apiError && (
        <Alert variant="danger" className="mb-3">
          {apiError}
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Title *</Form.Label>
          <Form.Control
            type="text"
            isInvalid={!!errors.title}
            {...register('title', {
              required: 'Title is required',
              maxLength: {
                value: 255,
                message: 'Title must be less than 255 characters',
              },
            })}
          />
          <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description *</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            isInvalid={!!errors.description}
            {...register('description', {
              required: 'Description is required',
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.description?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tags</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter tags separated by commas (e.g., react, performance, tips)"
            {...register('tags')}
          />
          <Form.Text className="text-muted">Separate multiple tags with commas</Form.Text>
        </Form.Group>

        <div className="d-flex gap-2 justify-content-end">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : initialData ? (
              'Update Insight'
            ) : (
              'Create Insight'
            )}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default InsightForm;

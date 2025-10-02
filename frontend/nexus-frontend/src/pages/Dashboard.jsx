import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Alert,
  Spinner,
  Form,
  InputGroup,
} from 'react-bootstrap';
import api from '../lib/api';
import InsightForm from '../components/InsightForm';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useAuth } from '../context/AuthContext';
import useInsights from '../hooks/useInsights'; // Import the custom hook

const Dashboard = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingInsight, setEditingInsight] = useState(null);
  const [search, setSearch] = useState(''); // Add search state

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingInsight, setDeletingInsight] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { user } = useAuth(); // Get current user
  const { updateInsight, loading: updateLoading, error: updateError } = useInsights(); // Use the custom hook

  // Fetch insights on component mount
  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await api.get('/insights');
      setInsights(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch insights. Please try again.');
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingInsight(null);
    setShowModal(true);
  };

  const handleEdit = (insight) => {
    setEditingInsight(insight);
    setShowModal(true);
  };

  const handleDeleteClick = (insight) => {
    setDeletingInsight(insight);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingInsight) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/insights/${deletingInsight.id}`);
      setInsights(insights.filter((insight) => insight.id !== deletingInsight.id));
      setShowDeleteModal(false);
      setDeletingInsight(null);
    } catch (err) {
      setError('Failed to delete insight. Please try again.');
      console.error('Error deleting insight:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeletingInsight(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingInsight(null);
  };

  const handleInsightSaved = (savedInsight) => {
    if (editingInsight) {
      // Update existing insight
      setInsights(
        insights.map((insight) => (insight.id === savedInsight.id ? savedInsight : insight))
      );
    } else {
      // Add new insight
      setInsights([savedInsight, ...insights]);
    }
    handleModalClose();
  };

  // Quick text update function using the new updateInsight API
  const handleQuickTextUpdate = async (insightId, newText) => {
    try {
      const updatedInsight = await updateInsight(insightId, newText);
      // Update the insight in the local state
      setInsights(insights.map((insight) => (insight.id === insightId ? updatedInsight : insight)));
    } catch (err) {
      setError('Failed to update insight text. Please try again.');
      console.error('Error updating insight text:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter insights based on search text
  const filteredInsights = useMemo(() => {
    if (!search.trim()) {
      return insights; // Return all insights if no search text
    }

    const searchLower = search.toLowerCase();
    return insights.filter((insight) => {
      // Search in title
      const titleMatch = insight.title?.toLowerCase().includes(searchLower);

      // Search in summary
      const summaryMatch = insight.summary?.toLowerCase().includes(searchLower);

      // Search in tags
      const tagsMatch = insight.tags?.some((tag) => tag.toLowerCase().includes(searchLower));

      // Return true if any field matches
      return titleMatch || summaryMatch || tagsMatch;
    });
  }, [insights, search]);

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading insights...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>All Insights</h1>
        <Button variant="primary" onClick={handleCreate}>
          Create New Insight
        </Button>
      </div>

      {/* Search Input Box */}
      <div className="mb-4">
        <Form.Group>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i> 🔍
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search insights by title, summary, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <Button
                variant="outline-secondary"
                onClick={() => setSearch('')}
                title="Clear search"
              >
                ✕
              </Button>
            )}
          </InputGroup>
        </Form.Group>
        {search && (
          <small className="text-muted">
            Showing {filteredInsights.length} of {insights.length} insights for "{search}"
          </small>
        )}
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {insights.length === 0 ? (
        <div className="text-center py-5">
          <h3 className="text-muted">No insights yet</h3>
          <p className="text-muted">Create your first insight to get started!</p>
          <Button variant="primary" onClick={handleCreate}>
            Create Your First Insight
          </Button>
        </div>
      ) : filteredInsights.length === 0 ? (
        <div className="text-center py-5">
          <h3 className="text-muted">No insights found</h3>
          <p className="text-muted">
            No insights match your search for "{search}". Try a different search term.
          </p>
          <Button variant="outline-secondary" onClick={() => setSearch('')}>
            Clear Search
          </Button>
        </div>
      ) : (
        <Row>
          {filteredInsights.map((insight) => {
            const isMyInsight = user && insight.author && insight.author.id === user.id;
            return (
              <Col key={insight.id} md={6} lg={4} className="mb-4">
                <Card className={`h-100 ${isMyInsight ? 'border-primary' : ''}`}>
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="mb-0">{insight.title}</Card.Title>
                      {isMyInsight && <span className="badge bg-primary ms-2">Mine</span>}
                    </div>
                    <Card.Text className="flex-grow-1">{insight.summary}</Card.Text>

                    {insight.tags && insight.tags.length > 0 && (
                      <div className="mb-2">
                        {insight.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="badge bg-secondary me-1"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSearch(tag)}
                            title={`Filter by tag: ${tag}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {insight.sourceUrl && (
                      <Card.Text>
                        <small className="text-muted">
                          <a href={insight.sourceUrl} target="_blank" rel="noopener noreferrer">
                            View Source
                          </a>
                        </small>
                      </Card.Text>
                    )}

                    <Card.Text>
                      <small className="text-muted">Created: {formatDate(insight.createdAt)}</small>
                    </Card.Text>

                    <Card.Text>
                      <small className="text-muted">
                        By: {insight.author?.name || insight.author?.email || 'Unknown'}
                      </small>
                    </Card.Text>

                    {/* Only show Edit/Delete buttons if the insight belongs to the current user */}
                    {user && insight.author && insight.author.id === user.id && (
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(insight)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(insight)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Modal for Create/Edit */}
      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingInsight ? 'Edit Insight' : 'Create New Insight'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InsightForm
            initialData={editingInsight}
            onSaved={handleInsightSaved}
            onCancel={handleModalClose}
          />
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Insight"
        message={
          deletingInsight
            ? `Are you sure you want to delete "${deletingInsight.title}"?`
            : 'Are you sure you want to delete this insight?'
        }
        loading={deleteLoading}
      />
    </Container>
  );
};

export default Dashboard;

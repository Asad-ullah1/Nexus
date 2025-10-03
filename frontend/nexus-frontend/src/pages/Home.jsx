import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container-fluid">
      <div className="row vh-100 align-items-center">
        <div className="col-lg-6 mx-auto text-center">
          <h1 className="display-4 fw-bold text-primary mb-4">Welcome to IdeaSpark</h1>
          <p className="lead mb-4">
            Capture, organize, and share your insights with ease. Transform your thoughts into
            actionable knowledge.
          </p>

          {isAuthenticated ? (
            <div>
              <h3 className="mb-3">Welcome back, {user?.name || user?.email}!</h3>
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline-primary btn-lg">
                Login
              </Link>
            </div>
          )}

          <div className="mt-5">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="text-center">
                  <div
                    className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className="bi bi-lightbulb fs-2 text-primary"></i>
                  </div>
                  <h5>Capture Ideas</h5>
                  <p className="text-muted">
                    Quickly save your thoughts and insights as they come to you.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div
                    className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className="bi bi-tags fs-2 text-primary"></i>
                  </div>
                  <h5>Organize</h5>
                  <p className="text-muted">
                    Use tags and categories to keep your insights organized.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <div
                    className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className="bi bi-share fs-2 text-primary"></i>
                  </div>
                  <h5>Share</h5>
                  <p className="text-muted">
                    Share your knowledge and learn from others' insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useEffect } from 'react';

function ImageCarousel({ resortPhotos }) {

  useEffect(() => {
    // Initialize Bootstrap carousel after component mounts
    const carouselElement = document.querySelector('#propertyCarousel');
    if (carouselElement && window.bootstrap) {
      new window.bootstrap.Carousel(carouselElement, {
        interval: 5000,
        wrap: true
      });
    }
  }, []);

  if (!resortPhotos || resortPhotos.length === 0) {
    return (
      <div style={{ 
        height: '100%', 
        width: '100%',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#f5f5f5',
        position: 'absolute',
        top: 0,
        left: 0
      }}>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>No photos available</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div 
        id="propertyCarousel" 
        className="carousel slide" 
        data-bs-ride="carousel" 
        style={{ height: '100%', width: '100%' }}
      >
        {/* Carousel Indicators */}
        {resortPhotos.length > 1 && (
          <div 
            className="carousel-indicators" 
            style={{ 
              bottom: '30px',
              zIndex: 15
            }}
          >
            {resortPhotos.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#propertyCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: '2px solid white',
                  backgroundColor: index === 0 ? 'white' : 'transparent',
                  margin: '0 6px'
                }}
              ></button>
            ))}
          </div>
        )}
        
        {/* Carousel Inner */}
        <div className="carousel-inner" style={{ height: '100%' }}>
          {resortPhotos.map((photo, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`} style={{ height: '100%' }}>
              <img
                src={photo}
                className="d-block w-100"
                alt={`Property view ${index + 1}`}
                style={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                onError={(e) => {
                  e.target.src = '/placeholder.jpg'; // fallback image
                }}
              />
              
              {/* Image Counter */}
              <div 
                style={{ 
                  position: 'absolute',
                  top: '20px', 
                  right: '20px',
                  zIndex: 15
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    display: 'inline-block',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <span style={{ 
                    color: 'white', 
                    fontSize: '14px', 
                    fontWeight: 'bold',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    {index + 1} / {resortPhotos.length}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Controls */}
        {resortPhotos.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#propertyCarousel"
              data-bs-slide="prev"
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 15,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <span 
                className="carousel-control-prev-icon" 
                aria-hidden="true"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23fff'%3e%3cpath d='m11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/%3e%3c/svg%3e\")",
                  width: '24px',
                  height: '24px'
                }}
              ></span>
            </button>
            
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#propertyCarousel"
              data-bs-slide="next"
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 15,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <span 
                className="carousel-control-next-icon" 
                aria-hidden="true"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23fff'%3e%3cpath d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e\")",
                  width: '24px',
                  height: '24px'
                }}
              ></span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageCarousel;
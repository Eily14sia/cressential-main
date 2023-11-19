import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Import styles for AnnotationLayer
import 'react-pdf/dist/esm/Page/TextLayer.css'; // Import styles for TextLayer
import interact from 'interactjs';
// Use the worker from the 'react-pdf' library for better PDF rendering performance
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function SignatureFieldSelector({fileUrl}) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [signatureCoordinates, setSignatureCoordinates] = useState({ x: 0, y: 0 });

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDocumentClick = (event) => {
    const boundingRect = event.target.getBoundingClientRect();
    const x = event.clientX - boundingRect.left;
    const y = event.clientY - boundingRect.top;
    setSignatureCoordinates({ x, y });
  };

  return (
    <>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading="Loading PDF..."
      >
        <Page
          pageNumber={pageNumber}
          onClick={handleDocumentClick}
        />
      </Document>
      <p>Page {pageNumber} of {numPages}</p>
      <p>Signature Field Coordinates: X: {signatureCoordinates.x}, Y: {signatureCoordinates.y}</p>
    </>
  );
}

export default SignatureFieldSelector;

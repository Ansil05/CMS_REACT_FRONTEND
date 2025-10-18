import React from 'react';

export default function LoadingButton({ loading, children, ...props }) {
  return (
    <button disabled={loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  );
}

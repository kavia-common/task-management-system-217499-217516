# Development Notes

This frontend uses Create React App tooling via "react-scripts".

If you see an error like:
  sh: 1: react-scripts: not found

Make sure dependencies are installed:
  npm ci
or
  npm install

Then run:
  npm start
  npm run build

Environment:
- API base URL is configured with REACT_APP_API_BASE, falling back to http://localhost:5001 if not set.

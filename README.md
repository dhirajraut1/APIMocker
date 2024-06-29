# APIMocker

This web application allows users to mock API endpoints using Express.js. Users can create, edit, delete, and copy endpoints and their responses. The application also saves these endpoints and responses in a JSON file to ensure data persistence.

### Features

- **Create Mock Endpoints**: Users can enter desired endpoints and responses through the web interface.
- **Edit Endpoints**: Users can edit existing endpoints and responses.
- **Delete Endpoints**: Users can delete endpoints they no longer need.
- **Copy Endpoints**: Users can copy existing endpoints for quick modifications.
- **Persistent Storage**: All endpoints and responses are saved in a JSON file to ensure they are not lost between sessions.

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dhirajraut1/APIMocker.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the application**:
   ```bash
   npm start
   ```

### Usage

1. **Access the web app**:
   Open your web browser and navigate to `http://localhost:3000`.

2. **Create a new endpoint**:
   - Navigate to the "Create/Edit Mock Endpoint" section.
   - Enter the desired endpoint path (e.g., `/api/v1/test`).
   - Enter the desired response in JSON format.
   - Click "Create Mock".

3. **Edit an existing endpoint**:
   - Locate the endpoint in the sidebar.
   - Click the "Edit" button next to the endpoint.
   - Modify the endpoint path or response as needed.
   - Click "Save".

4. **Delete an endpoint**:
   - Locate the endpoint in the sidebar.
   - Click the "Delete" button next to the endpoint.

5. **Copy an endpoint**:
   - Locate the endpoint in the sidebar.
   - Click the "Copy" button next to the endpoint.
   - Modify the copied endpoint path or response if needed.
   - Click "Save".

### Screenshots
![image](https://github.com/dhirajraut1/APIMocker/assets/63958838/fd428c95-4fa0-4cae-b75f-3eea1ac32703)


### Contributing

1. **Fork the repository**.
2. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**:
   ```bash
   git commit -m 'Add some feature'
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a pull request**.
---

Enjoy using the web app to mock your API endpoints with ease!

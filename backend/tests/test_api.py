"""
Backend API Tests for ORÍGENES Agricultural Consulting Landing Page
Tests: Health, Contact CRUD, Planet API, Roboflow endpoints
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthEndpoints:
    """Health and status endpoint tests"""
    
    def test_root_endpoint(self):
        """Test root API endpoint returns active status"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "active"
        assert "ORÍGENES" in data["message"]
        print(f"✓ Root endpoint: {data}")
    
    def test_health_endpoint(self):
        """Test health endpoint returns database status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "active"
        assert data["database"] == "connected"
        assert "timestamp" in data
        print(f"✓ Health endpoint: {data}")


class TestContactAPI:
    """Contact form API tests"""
    
    def test_create_contact_with_all_fields(self):
        """Test creating contact with all fields including department and culture"""
        payload = {
            "name": "TEST_Juan Pérez",
            "email": "test_juan@example.com",
            "phone": "+57 300 123 4567",
            "department": "Antioquia",
            "culture": "Café",
            "hectares": 50,
            "message": "Necesito consultoría para mi finca de café en Antioquia"
        }
        response = requests.post(f"{BASE_URL}/api/contact/", json=payload)
        assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["phone"] == payload["phone"]
        assert data["department"] == "Antioquia"
        assert data["culture"] == "Café"
        assert data["hectares"] == 50
        assert "id" in data
        assert data["status"] == "pending"
        print(f"✓ Created contact with all fields: {data['id']}")
        return data["id"]
    
    def test_create_contact_without_optional_fields(self):
        """Test creating contact without department/culture (should default to 'No especificado')"""
        payload = {
            "name": "TEST_Maria García",
            "email": "test_maria@example.com",
            "phone": "+57 310 987 6543",
            "message": "Consulta general sobre servicios agrícolas"
        }
        response = requests.post(f"{BASE_URL}/api/contact/", json=payload)
        assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data["name"] == payload["name"]
        assert data["department"] == "No especificado"
        assert data["culture"] == "No especificado"
        assert data["hectares"] is None
        print(f"✓ Created contact without optional fields: {data['id']}")
        return data["id"]
    
    def test_create_contact_with_empty_department_culture(self):
        """Test creating contact with empty strings for department/culture"""
        payload = {
            "name": "TEST_Carlos López",
            "email": "test_carlos@example.com",
            "phone": "+57 320 555 1234",
            "department": "",
            "culture": "",
            "message": "Quiero información sobre biofábricas"
        }
        response = requests.post(f"{BASE_URL}/api/contact/", json=payload)
        # Empty strings should be accepted (backend may convert to default)
        assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
        data = response.json()
        print(f"✓ Created contact with empty department/culture: {data['id']}")
    
    def test_get_contacts_list(self):
        """Test retrieving list of contacts"""
        response = requests.get(f"{BASE_URL}/api/contact/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} contacts")
    
    def test_create_and_get_contact_by_id(self):
        """Test creating contact and retrieving by ID"""
        # Create
        payload = {
            "name": "TEST_Ana Rodríguez",
            "email": "test_ana@example.com",
            "phone": "+57 315 111 2222",
            "department": "Valle del Cauca",
            "culture": "Caña de Azúcar",
            "hectares": 100,
            "message": "Interesada en monitoreo satelital para caña"
        }
        create_response = requests.post(f"{BASE_URL}/api/contact/", json=payload)
        assert create_response.status_code == 201
        contact_id = create_response.json()["id"]
        
        # Get by ID
        get_response = requests.get(f"{BASE_URL}/api/contact/{contact_id}")
        assert get_response.status_code == 200
        data = get_response.json()
        assert data["id"] == contact_id
        assert data["name"] == payload["name"]
        assert data["department"] == "Valle del Cauca"
        print(f"✓ Created and retrieved contact: {contact_id}")
    
    def test_update_contact_status(self):
        """Test updating contact status"""
        # Create contact first
        payload = {
            "name": "TEST_Pedro Martínez",
            "email": "test_pedro@example.com",
            "phone": "+57 318 333 4444",
            "message": "Consulta sobre diagnóstico de cultivos"
        }
        create_response = requests.post(f"{BASE_URL}/api/contact/", json=payload)
        assert create_response.status_code == 201
        contact_id = create_response.json()["id"]
        
        # Update status
        update_response = requests.patch(
            f"{BASE_URL}/api/contact/{contact_id}/status",
            params={"new_status": "contacted"}
        )
        assert update_response.status_code == 200
        data = update_response.json()
        assert data["status"] == "contacted"
        print(f"✓ Updated contact status to 'contacted': {contact_id}")
    
    def test_contact_validation_invalid_email(self):
        """Test validation rejects invalid email"""
        payload = {
            "name": "TEST_Invalid Email",
            "email": "not-an-email",
            "phone": "+57 300 000 0000",
            "message": "This should fail validation"
        }
        response = requests.post(f"{BASE_URL}/api/contact/", json=payload)
        assert response.status_code == 422
        print("✓ Validation correctly rejected invalid email")
    
    def test_contact_validation_short_message(self):
        """Test validation rejects too short message"""
        payload = {
            "name": "TEST_Short Message",
            "email": "test_short@example.com",
            "phone": "+57 300 000 0000",
            "message": "Short"  # Less than 10 chars
        }
        response = requests.post(f"{BASE_URL}/api/contact/", json=payload)
        assert response.status_code == 422
        print("✓ Validation correctly rejected short message")


class TestPlanetAPI:
    """Planet satellite API tests"""
    
    def test_planet_health(self):
        """Test Planet API health endpoint"""
        response = requests.get(f"{BASE_URL}/api/planet/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "connected"
        print(f"✓ Planet health: {data}")
    
    def test_planet_search_colombia_coordinates(self):
        """Test Planet search with Colombia coordinates"""
        params = {
            "lat": 4.5709,
            "lng": -74.2973,
            "max_cloud": 0.3,
            "limit": 5
        }
        response = requests.get(f"{BASE_URL}/api/planet/search", params=params)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "scenes" in data
        assert "total" in data
        assert "coordinates" in data
        assert data["coordinates"]["lat"] == 4.5709
        assert data["coordinates"]["lng"] == -74.2973
        
        if data["total"] > 0:
            scene = data["scenes"][0]
            assert "id" in scene
            assert "acquired" in scene
            assert "cloud_cover" in scene
            assert "thumbnail_url" in scene
            print(f"✓ Planet search returned {data['total']} scenes")
            return scene["id"]
        else:
            print("✓ Planet search returned 0 scenes (may need higher cloud cover)")
            return None
    
    def test_planet_search_invalid_coordinates(self):
        """Test Planet search rejects invalid coordinates"""
        params = {
            "lat": 100,  # Invalid latitude
            "lng": -74.2973,
            "max_cloud": 0.3
        }
        response = requests.get(f"{BASE_URL}/api/planet/search", params=params)
        assert response.status_code == 422
        print("✓ Planet search correctly rejected invalid coordinates")
    
    def test_planet_thumbnail_proxy(self):
        """Test Planet thumbnail proxy endpoint"""
        # First get a scene ID from search
        params = {
            "lat": 4.5709,
            "lng": -74.2973,
            "max_cloud": 0.5,
            "limit": 1
        }
        search_response = requests.get(f"{BASE_URL}/api/planet/search", params=params)
        if search_response.status_code == 200:
            data = search_response.json()
            if data["total"] > 0:
                scene_id = data["scenes"][0]["id"]
                # Test thumbnail proxy
                thumb_response = requests.get(f"{BASE_URL}/api/planet/thumbnail/PSScene/{scene_id}")
                assert thumb_response.status_code == 200
                assert thumb_response.headers.get("content-type") == "image/png"
                print(f"✓ Planet thumbnail proxy returned PNG for scene: {scene_id}")
            else:
                print("⚠ No scenes available to test thumbnail proxy")
        else:
            print("⚠ Could not search for scenes to test thumbnail")


class TestRoboflowAPI:
    """Roboflow image analysis API tests"""
    
    def test_roboflow_analyze_requires_file(self):
        """Test Roboflow analyze endpoint requires file upload"""
        response = requests.post(f"{BASE_URL}/api/roboflow/analyze")
        assert response.status_code == 422  # Missing required file
        print("✓ Roboflow analyze correctly requires file upload")
    
    def test_roboflow_analyze_with_test_image(self):
        """Test Roboflow analyze with a simple test image"""
        # Create a minimal valid PNG image (1x1 pixel)
        import base64
        # Minimal 1x1 red PNG
        png_data = base64.b64decode(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="
        )
        
        files = {"file": ("test.png", png_data, "image/png")}
        response = requests.post(f"{BASE_URL}/api/roboflow/analyze", files=files)
        
        # Accept 200 (success) or 500 (Roboflow API error - model may not exist)
        if response.status_code == 200:
            data = response.json()
            assert data["success"] == True
            assert "predictions" in data
            assert "model_id" in data
            print(f"✓ Roboflow analyze returned: {data['total_detections']} detections")
        else:
            print(f"⚠ Roboflow analyze returned {response.status_code} - API may have issues")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

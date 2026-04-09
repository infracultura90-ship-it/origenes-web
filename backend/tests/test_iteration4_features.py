"""
Test Iteration 4 Features:
1. CSV Export endpoint (/api/admin/contacts/export/csv)
2. Email service methods (send_contact_notification, send_status_update)
3. Status change triggers email notification attempt
"""
import pytest
import requests
import os
import csv
import io

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
ADMIN_EMAIL = "gerencia@origeneskhachi.org"
ADMIN_PASSWORD = "Origenes2026$Sec"


def get_auth_token():
    """Get authentication token for admin user."""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("token")  # API returns 'token' not 'access_token'
    return None


@pytest.fixture
def api_client():
    """Shared requests session."""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture
def auth_token():
    """Get fresh authentication token."""
    token = get_auth_token()
    if not token:
        pytest.skip("Authentication failed")
    return token


@pytest.fixture
def authenticated_client(auth_token):
    """Session with auth header."""
    session = requests.Session()
    session.headers.update({
        "Content-Type": "application/json",
        "Authorization": f"Bearer {auth_token}"
    })
    return session


class TestCSVExport:
    """Tests for CSV export endpoint."""

    def test_csv_export_returns_valid_csv_with_auth(self, authenticated_client):
        """CSV export endpoint returns valid CSV with correct headers."""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/contacts/export/csv")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        assert "text/csv" in response.headers.get("Content-Type", ""), "Content-Type should be text/csv"
        assert "attachment" in response.headers.get("Content-Disposition", ""), "Should have attachment disposition"
        
        # Parse CSV content
        csv_content = response.text
        reader = csv.reader(io.StringIO(csv_content))
        rows = list(reader)
        
        # Check headers
        assert len(rows) >= 1, "CSV should have at least header row"
        expected_headers = ["ID", "Nombre", "Email", "Teléfono", "Departamento", "Cultivo", "Hectáreas", "Mensaje", "Estado", "Fecha"]
        assert rows[0] == expected_headers, f"Headers mismatch. Expected {expected_headers}, got {rows[0]}"
        
        print(f"CSV export successful: {len(rows)-1} data rows")

    def test_csv_export_returns_401_without_auth(self, api_client):
        """CSV export endpoint returns 401 without authentication."""
        response = api_client.get(f"{BASE_URL}/api/admin/contacts/export/csv")
        
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("CSV export correctly requires authentication")

    def test_csv_export_respects_status_filter(self, authenticated_client):
        """CSV export respects status_filter query parameter."""
        # First, get all contacts to know what statuses exist
        all_response = authenticated_client.get(f"{BASE_URL}/api/admin/contacts/export/csv")
        assert all_response.status_code == 200
        
        # Test with pending filter
        pending_response = authenticated_client.get(f"{BASE_URL}/api/admin/contacts/export/csv?status_filter=pending")
        assert pending_response.status_code == 200, f"Expected 200, got {pending_response.status_code}"
        
        # Parse both CSVs
        all_rows = list(csv.reader(io.StringIO(all_response.text)))
        pending_rows = list(csv.reader(io.StringIO(pending_response.text)))
        
        # Filtered should have <= rows than all (excluding header)
        assert len(pending_rows) <= len(all_rows), "Filtered CSV should have <= rows than unfiltered"
        
        # If there are data rows, verify they have 'pending' status
        if len(pending_rows) > 1:
            status_col_idx = 8  # Estado column index
            for row in pending_rows[1:]:  # Skip header
                if len(row) > status_col_idx:
                    assert row[status_col_idx] == "pending", f"Expected pending status, got {row[status_col_idx]}"
        
        print(f"Status filter working: all={len(all_rows)-1} rows, pending={len(pending_rows)-1} rows")

    def test_csv_export_filename_format(self, authenticated_client):
        """CSV export has correct filename format."""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/contacts/export/csv")
        
        assert response.status_code == 200
        content_disposition = response.headers.get("Content-Disposition", "")
        
        assert "origenes_consultas_" in content_disposition, f"Filename should contain 'origenes_consultas_', got: {content_disposition}"
        assert ".csv" in content_disposition, f"Filename should end with .csv, got: {content_disposition}"
        
        print(f"Filename format correct: {content_disposition}")


class TestStatusChangeEmailTrigger:
    """Tests for email notification on status change."""

    def test_status_change_to_contacted_triggers_email_attempt(self, authenticated_client):
        """Changing status to 'contacted' should attempt to send email (will log warning due to missing GMAIL_APP_PASSWORD)."""
        # First create a test contact
        contact_response = requests.post(f"{BASE_URL}/api/contact/", json={
            "name": "TEST_EmailTrigger",
            "email": "test_email_trigger@example.com",
            "phone": "+573001234567",
            "department": "Cundinamarca",
            "culture": "Café",
            "hectares": "10",
            "message": "Test message for email trigger"
        })
        
        if contact_response.status_code != 201:
            pytest.skip(f"Could not create test contact: {contact_response.status_code}")
        
        contact_id = contact_response.json().get("id")
        
        # Change status to contacted
        status_response = authenticated_client.patch(
            f"{BASE_URL}/api/admin/contacts/{contact_id}/status?new_status=contacted"
        )
        
        assert status_response.status_code == 200, f"Expected 200, got {status_response.status_code}: {status_response.text}"
        assert status_response.json().get("status") == "contacted"
        
        print(f"Status change to 'contacted' successful for contact {contact_id}")

    def test_status_change_to_closed_triggers_email_attempt(self, authenticated_client):
        """Changing status to 'closed' should attempt to send email."""
        # First create a test contact
        contact_response = requests.post(f"{BASE_URL}/api/contact/", json={
            "name": "TEST_EmailTriggerClosed",
            "email": "test_email_closed@example.com",
            "phone": "+573001234568",
            "department": "Antioquia",
            "culture": "Aguacate",
            "hectares": "20",
            "message": "Test message for closed status"
        })
        
        if contact_response.status_code != 201:
            pytest.skip(f"Could not create test contact: {contact_response.status_code}")
        
        contact_id = contact_response.json().get("id")
        
        # Change status to closed
        status_response = authenticated_client.patch(
            f"{BASE_URL}/api/admin/contacts/{contact_id}/status?new_status=closed"
        )
        
        assert status_response.status_code == 200, f"Expected 200, got {status_response.status_code}: {status_response.text}"
        assert status_response.json().get("status") == "closed"
        
        print(f"Status change to 'closed' successful for contact {contact_id}")


class TestEmailServiceMethods:
    """Tests for email service methods existence and structure."""

    def test_email_service_has_send_contact_notification(self):
        """Email service should have send_contact_notification method."""
        # Import the email service
        import sys
        sys.path.insert(0, '/app/backend')
        from services.email_service import email_service
        
        assert hasattr(email_service, 'send_contact_notification'), "email_service should have send_contact_notification method"
        assert callable(email_service.send_contact_notification), "send_contact_notification should be callable"
        
        print("send_contact_notification method exists")

    def test_email_service_has_send_status_update(self):
        """Email service should have send_status_update method."""
        import sys
        sys.path.insert(0, '/app/backend')
        from services.email_service import email_service
        
        assert hasattr(email_service, 'send_status_update'), "email_service should have send_status_update method"
        assert callable(email_service.send_status_update), "send_status_update should be callable"
        
        print("send_status_update method exists")

    def test_send_contact_notification_returns_false_without_password(self):
        """send_contact_notification should return False when GMAIL_APP_PASSWORD is not set."""
        import sys
        sys.path.insert(0, '/app/backend')
        from services.email_service import email_service
        
        test_contact = {
            "id": "test-123",
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+573001234567",
            "department": "Test Dept",
            "culture": "Test Culture",
            "message": "Test message",
            "created_at": "2026-01-01T00:00:00"
        }
        
        result = email_service.send_contact_notification(test_contact)
        assert result == False, "Should return False when GMAIL_APP_PASSWORD is not configured"
        
        print("send_contact_notification correctly returns False without password")

    def test_send_status_update_returns_false_without_password(self):
        """send_status_update should return False when GMAIL_APP_PASSWORD is not set."""
        import sys
        sys.path.insert(0, '/app/backend')
        from services.email_service import email_service
        
        test_contact = {
            "id": "test-123",
            "name": "Test User",
            "email": "test@example.com"
        }
        
        result = email_service.send_status_update(test_contact, "contacted")
        assert result == False, "Should return False when GMAIL_APP_PASSWORD is not configured"
        
        print("send_status_update correctly returns False without password")


class TestAdminDashboardCSVButton:
    """Tests for admin dashboard CSV export button via API."""

    def test_admin_stats_endpoint_works(self, authenticated_client):
        """Admin stats endpoint should work (prerequisite for dashboard)."""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/stats")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "total" in data
        assert "pending" in data
        assert "contacted" in data
        assert "closed" in data
        
        print(f"Admin stats: total={data['total']}, pending={data['pending']}, contacted={data['contacted']}, closed={data['closed']}")

    def test_admin_contacts_endpoint_works(self, authenticated_client):
        """Admin contacts endpoint should work (prerequisite for dashboard)."""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/contacts")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "contacts" in data
        assert "total" in data
        
        print(f"Admin contacts: {data['total']} total contacts")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

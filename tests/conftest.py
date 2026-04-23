import pytest
from fastapi.testclient import TestClient
import fakeredis
import api.main  # Import api module


@pytest.fixture(autouse=True)
def mock_redis():
    # Create the fake redis instance
    fake_r = fakeredis.FakeRedis(decode_responses=True)

    # Swap the real 'r' inside the api.main module for fake one
    api.main.r = fake_r

    yield fake_r

    # Clean up after the test
    fake_r.flushall()


@pytest.fixture
def client():
    # Now when TestClient starts, it uses the mocked 'api.main.r'
    return TestClient(api.main.app)

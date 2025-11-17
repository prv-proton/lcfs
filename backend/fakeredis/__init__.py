from typing import Any


class FakeServer:
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        self.connected = False


class _FakeRedis:
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        self.server = kwargs.get("server")
        self.decode_responses = kwargs.get("decode_responses", False)

    async def close(self) -> None:
        return None


class _AioRedisModule:
    FakeRedis = _FakeRedis


aioredis = _AioRedisModule()

from functools import lru_cache
from app.config import settings


@lru_cache(maxsize=1)
def _get_client():
    from groq import Groq

    return Groq(api_key=settings.groq_api_key)


def complete(system_prompt: str, user_prompt: str, history: list[dict] | None = None) -> str:
    client = _get_client()
    messages = [{"role": "system", "content": system_prompt}]
    for turn in history or []:
        messages.append({"role": turn["role"], "content": turn["content"]})
    messages.append({"role": "user", "content": user_prompt})

    response = client.chat.completions.create(
        model=settings.groq_model,
        messages=messages,
        temperature=0.3,  # factuel plutôt que créatif : c'est un assistant e-commerce
        max_tokens=500,
    )
    return response.choices[0].message.content

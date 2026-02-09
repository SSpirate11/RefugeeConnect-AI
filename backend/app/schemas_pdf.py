from pydantic import BaseModel
from typing import List, Optional

class PortfolioRequest(BaseModel):
    analysis: dict
    mapping: dict

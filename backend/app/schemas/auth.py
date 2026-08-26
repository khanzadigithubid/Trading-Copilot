from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    capital: float = Field(default=10000.0, ge=0)
    risk_tolerance: float = Field(default=2.0, ge=0.1, le=10)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    email: str
    risk_tolerance: float
    capital: float

    class Config:
        from_attributes = True


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8)


class MessageResponse(BaseModel):
    message: str


class ForgotPasswordResponse(BaseModel):
    message: str
    # reset_token and email are required by the frontend EmailJS integration.
    # Without server-side email sending, the token must travel through the client.
    # Fields are excluded from OpenAPI docs to reduce exposure.
    reset_token: str = ""
    email: str = ""

    model_config = {"json_schema_extra": {"x-internal": True}}

# Sistema POS

## Frontend

```textplain
/
├── login/
└── users/
    ├── clients/
    ├── sellers/
    └── suppliers/
```

## Backend

```textplain
api/
├── POST login/    - Inicia sesión (Vendedor)
├── POST logout/   - Cierra sesión
└── GET  users/    - Lista todos los usuarios
    ├── GET    :id/      - Obtiene la información general del usuario
    ├── GET    :type/    - Lista todos los usuarios de un tipo
    ├── POST   :type/    - Crea un nuevo usuario del tipo mencionado
    ├── PATCH  :id/      - Actualiza la información del usuario
    ├── DELETE :id/      - Elimina a un usuario y todos sus tipos
    └── DELETE :type/:id - Elimina la información de un tipo de usuario

type: clients, sellers, suppliers
```

## Database

```mermaid
erDiagram
    ENUM_CONTACT ||--o{ CONTACTS_USERS : contains
    ENUM_GENDER ||--o{ CLIENTS : identified_by
    ENUM_GENDER ||--o{ SELLERS : identified_by
    ENUM_IDENTIFICATION ||--o{ USERS : identified_by
    ENUM_PERMISSION ||--o{ PERMISSIONS_ROLES : has
    ENUM_ROLE ||--o{ SELLERS : assigned
    ENUM_ROLE ||--o{ PERMISSIONS_ROLES : has

    USERS ||--o{ CLIENTS : is
    USERS ||--o{ SUPPLIERS : is
    USERS ||--o{ SELLERS : is
    USERS ||--o{ CONTACTS_USERS : contacted_by

    SELLERS ||--o{ SELLER_HIERARCHY : managed_by
```

# Sistema POS

## Frontend

```textplain
/ - Panel de adminsitración
├── login/ - Formulario de inicio de sesión (Vendedor)
├── user/
│   └── profile/ - Vista del perfil actual
└── users/ - Lista de todos los usuarios
    └── [type]/ - Lista de usuarios por tipo

type: clients, sellers, suppliers
```

## Backend

```swiftmark
api/ [
  db/ -DEV- [
    DELETE `Elimina toda la base de datos`
    list/ [
      DELETE `Elimina las tablas de listas`
      default-data/ [
        POST `Carga valores mínimos en las tablas de listas`
      ]
    ]
    users/ [
      DELETE `Elimina las tablas de tipos de usuarios y usuarios`
      test/ [
        POST `Crea usuarios de prueba`
      ]
    ]
  ]
  session/ [
    login/ [
      POST `Inicia sesión (Vendedor)`
      local-storage/ -DEV- [
        POST `Reenvia la cookie si está en el loscalStorage`
      ]
    ]
    logout/ [
      POST `Cierra sesión`
    ]
  ]
  list/ [
    identifications/ [
      GET `Trae el listado de tipos de identificación`
    ]
  ]
  users/ [
    GET `Lista todos los usuarios`
    :id/ [
      -id~uuid-
      GET    `Obtiene la información general del usuario`
      PATCH  `Actualiza la información del usuario`
      DELETE `Elimina un usuario y todos sus tipos`
    ]
    :type/ [
      `clients`sellers`suppliers`
      GET  `Lista todos los usuarios de un tipo`
      POST `Crea un usuario del tipo mencionado`
      :id/ [
        DELETE `Elimina la información de un usuario en un tipo concreto`
      ]
    ]
  ]
]
```

## Database

```mermaid
erDiagram
    LIST_CONTACT ||--o{ CONTACTS_USERS : contains
    LIST_GENDER ||--o{ CLIENTS : identified_by
    LIST_GENDER ||--o{ SELLERS : identified_by
    LIST_IDENTIFICATION ||--o{ USERS : identified_by
    LIST_PERMISSION ||--o{ PERMISSIONS_ROLES : has
    LIST_ROLE ||--o{ SELLERS : assigned
    LIST_ROLE ||--o{ PERMISSIONS_ROLES : has

    USERS ||--o{ CLIENTS : is
    USERS ||--o{ SUPPLIERS : is
    USERS ||--o{ SELLERS : is
    USERS ||--o{ CONTACTS_USERS : contacted_by

    SELLERS ||--o{ SELLER_HIERARCHY : managed_by
```

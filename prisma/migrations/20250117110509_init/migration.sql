-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "bio" TEXT,
    "telefono" TEXT,
    "ubicacion" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "premiumUntil" DATETIME
);

-- CreateTable
CREATE TABLE "Anuncio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" REAL NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "vistas" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "condicion" TEXT NOT NULL DEFAULT 'NUEVO',
    "envio" BOOLEAN NOT NULL DEFAULT false,
    "precioNegociable" BOOLEAN NOT NULL DEFAULT false,
    "destacadoHasta" DATETIME,
    "imagenes" TEXT NOT NULL,
    "video" TEXT,
    "usuarioId" TEXT NOT NULL,
    CONSTRAINT "Anuncio_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Anuncio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "icono" TEXT,
    "slug" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,
    CONSTRAINT "Categoria_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Categoria" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favorito" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,
    "anuncioId" TEXT NOT NULL,
    CONSTRAINT "Favorito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorito_anuncioId_fkey" FOREIGN KEY ("anuncioId") REFERENCES "Anuncio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "comentario" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "anuncioId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "receptorId" TEXT NOT NULL,
    CONSTRAINT "Review_anuncioId_fkey" FOREIGN KEY ("anuncioId") REFERENCES "Anuncio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_receptorId_fkey" FOREIGN KEY ("receptorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contenido" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "anuncioId" TEXT NOT NULL,
    "emisorId" TEXT NOT NULL,
    "receptorId" TEXT NOT NULL,
    CONSTRAINT "Mensaje_anuncioId_fkey" FOREIGN KEY ("anuncioId") REFERENCES "Anuncio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Mensaje_emisorId_fkey" FOREIGN KEY ("emisorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Mensaje_receptorId_fkey" FOREIGN KEY ("receptorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,
    CONSTRAINT "Notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Etiqueta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EtiquetasEnAnuncios" (
    "etiquetaId" TEXT NOT NULL,
    "anuncioId" TEXT NOT NULL,

    PRIMARY KEY ("etiquetaId", "anuncioId"),
    CONSTRAINT "EtiquetasEnAnuncios_etiquetaId_fkey" FOREIGN KEY ("etiquetaId") REFERENCES "Etiqueta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EtiquetasEnAnuncios_anuncioId_fkey" FOREIGN KEY ("anuncioId") REFERENCES "Anuncio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_slug_key" ON "Categoria"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Favorito_usuarioId_anuncioId_key" ON "Favorito"("usuarioId", "anuncioId");

-- CreateIndex
CREATE UNIQUE INDEX "Etiqueta_nombre_key" ON "Etiqueta"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Etiqueta_slug_key" ON "Etiqueta"("slug");

-- CreateTable
CREATE TABLE "Notificacao" (
    "ID_Notificacao" SERIAL NOT NULL,
    "ID_Usuario" INTEGER NOT NULL,
    "EventoId" TEXT NOT NULL,
    "Titulo" TEXT NOT NULL,
    "Mensagem" TEXT NOT NULL,
    "Lida" BOOLEAN NOT NULL DEFAULT false,
    "DataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("ID_Notificacao")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notificacao_EventoId_key" ON "Notificacao"("EventoId");

-- CreateIndex
CREATE INDEX "Notificacao_ID_Usuario_DataCriacao_idx" ON "Notificacao"("ID_Usuario", "DataCriacao");

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "Usuario"("ID_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;

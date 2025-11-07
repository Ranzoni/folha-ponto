-- CreateTable
CREATE TABLE "log_events" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "event_type" SMALLINT NOT NULL,
    "date_occurred" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_events_pkey" PRIMARY KEY ("id")
);

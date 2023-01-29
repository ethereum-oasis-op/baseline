-- AlterTable
ALTER TABLE "BpiAccount" ADD COLUMN     "authorizationCondition" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "stateObjectProverSystem" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "stateObjectStorage" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "BpiSubjectAccount" ADD COLUMN     "authenticationPolicy" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "authorizationPolicy" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "recoveryKey" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "verifiableCredential" TEXT NOT NULL DEFAULT '';

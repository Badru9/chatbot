@startuml
title Class Diagram Portal Dosen dengan Chatbot Personal

left to right direction
skinparam shadowing false
skinparam class {
BackgroundColor White
BorderColor Black
ArrowColor Black
}
skinparam packageStyle rectangle

package "Authentication Domain" {

    enum UserRole {
        ADMIN
        DOSEN
    }

    class User {
        +id: String
        +nidnNip: String
        +name: String
        +email: String
        +programStudi: String
        +role: UserRole
        +isActive: Boolean
        +emailVerified: Boolean
        +createdAt: DateTime
        +updatedAt: DateTime
        --
        +login()
        +logout()
        +updateOwnProfile()
    }

    class Account {
        +id: String
        +userId: String
        +providerId: String
        +accountId: String
        -password: String
        +createdAt: DateTime
        +updatedAt: DateTime
        --
        +updatePassword()
    }

    class Session {
        +id: String
        +userId: String
        +token: String
        +expiresAt: DateTime
        +ipAddress: String
        +userAgent: String
        +createdAt: DateTime
        +updatedAt: DateTime
        --
        +isExpired(): Boolean
        +revoke()
    }

    class Verification {
        +id: String
        +identifier: String
        +value: String
        +expiresAt: DateTime
        +createdAt: DateTime
        +updatedAt: DateTime
    }

}

package "Portal Domain" {

    class PortalMenu {
        +id: String
        +title: String
        +description: String
        +href: String
        +order: Integer
        +isActive: Boolean
        +createdBy: String
        +createdAt: DateTime
        +updatedAt: DateTime
        --
        +create()
        +update()
        +changeOrder()
        +toggleStatus()
        +delete()
    }

}

package "Document Domain" {

    enum DocumentScope {
        PERSONAL
        INSTITUTIONAL
    }

    enum ProcessingStatus {
        PENDING
        PROCESSING
        COMPLETED
        FAILED
    }

    class Document {
        +id: String
        +ownerId: String
        +createdBy: String
        +title: String
        +fileName: String
        +filePath: String
        +fileHash: String
        +mimeType: String
        +fileSize: Integer
        +scope: DocumentScope
        +status: ProcessingStatus
        +version: Integer
        +isActive: Boolean
        +errorMessage: String
        +createdAt: DateTime
        +updatedAt: DateTime
        --
        +upload()
        +uploadNewVersion()
        +updateStatus()
        +activate()
        +deactivate()
    }

    class PdfChunk {
        +id: Integer
        +documentId: String
        +pageNumber: Integer
        +chunkIndex: Integer
        +chunkText: Text
        +tokenCount: Integer
        +embedding: Vector
        +metadata: Json
        +createdAt: DateTime
        --
        +createEmbedding()
    }

    class InstitutionalQA {
        +id: String
        +question: Text
        +answer: Text
        +embedding: Vector
        +isActive: Boolean
        +createdBy: String
        +createdAt: DateTime
        +updatedAt: DateTime
        --
        +create()
        +update()
        +toggleStatus()
        +delete()
    }

}

package "Chatbot Domain" {

    enum MessageRole {
        USER
        ASSISTANT
        SYSTEM
    }

    class Conversation {
        +id: String
        +userId: String
        +title: String
        +createdAt: DateTime
        +updatedAt: DateTime
        --
        +create()
        +generateTitle()
        +rename()
        +delete()
    }

    class Message {
        +id: String
        +conversationId: String
        +role: MessageRole
        +content: Text
        +isGeneralAnswer: Boolean
        +deletedAt: DateTime
        +createdAt: DateTime
        --
        +copy()
        +regenerate()
        +softDelete()
    }

    class MessageDocumentSelection {
        +id: String
        +messageId: String
        +documentId: String
        +createdAt: DateTime
    }

    class MessageSource {
        +id: String
        +messageId: String
        +documentId: String
        +createdAt: DateTime
    }

}

package "Security Domain" {

    class AuditLog {
        +id: String
        +actorId: String
        +action: String
        +entityType: String
        +entityId: String
        +ipAddress: String
        +userAgent: String
        +metadata: Json
        +createdAt: DateTime
        --
        +record()
    }

}

package "Application Services" {

    class ChatbotService <<service>> {
        +classifyQuestion()
        +loadConversationContext()
        +retrievePersonalDocuments()
        +retrieveInstitutionalDataset()
        +generateDocumentAnswer()
        +generateGeneralAnswer()
    }

    class DocumentProcessingService <<service>> {
        +validatePdf()
        +extractText()
        +splitChunks()
        +generateEmbedding()
        +processDocument()
        +reprocessDocument()
    }

}

User --> UserRole : role
User "1" _-- "0.._" Account : owns
User "1" _-- "0.._" Session : has
User "1" --> "0..\*" Verification : requests

User "1" --> "0.._" Document : owns/uploads
User "1" --> "0.._" Conversation : creates
User "1" --> "0.._" PortalMenu : manages
User "1" --> "0.._" InstitutionalQA : manages
User "0..1" --> "0..\*" AuditLog : performs

Document --> DocumentScope : scope
Document --> ProcessingStatus : status
Document "1" _-- "0.._" PdfChunk : contains

Conversation "1" _-- "1.._" Message : contains
Message --> MessageRole : role

Message "1" _-- "0.._" MessageDocumentSelection : selections
Document "1" <-- "0..\*" MessageDocumentSelection : selectedDocument

Message "1" _-- "0.._" MessageSource : sources
Document "1" <-- "0..\*" MessageSource : sourceDocument

DocumentProcessingService ..> Document : processes
DocumentProcessingService ..> PdfChunk : creates
DocumentProcessingService ..> InstitutionalQA : processes

ChatbotService ..> Conversation : reads
ChatbotService ..> Message : creates
ChatbotService ..> PdfChunk : retrieves
ChatbotService ..> InstitutionalQA : retrieves
ChatbotService ..> MessageSource : records

note right of User
Admin dan Dosen tidak dibuat
sebagai class terpisah.

Perbedaan hak akses ditentukan
melalui atribut role.
end note

note bottom of Document
Dokumen PERSONAL wajib memiliki ownerId.

Dokumen INSTITUTIONAL dikelola Admin/USI
dan digunakan sebagai dataset dasar.
end note

note bottom of Message
isGeneralAnswer = true menunjukkan bahwa
jawaban tidak berasal dari dokumen dan
harus disertai peringatan kepada dosen.
end note

@enduml

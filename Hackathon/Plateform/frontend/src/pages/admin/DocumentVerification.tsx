
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockDocuments } from "@/data/mockData";
import { Document as DocumentType } from "@/types";
import {
  FileCheck,
  FileText,
  Search,
  CheckCheck,
  X,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const DocumentVerification = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter documents based on search term and status filter
  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? doc.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Handle document verification
  const handleVerify = (verify: boolean) => {
    if (!selectedDocument) return;

    toast({
      title: verify ? "Document vérifié" : "Document rejeté",
      description: verify
        ? "Le document a été marqué comme vérifié"
        : "Le document a été marqué comme rejeté",
      variant: verify ? "default" : "destructive",
    });

    setIsDialogOpen(false);
    setSelectedDocument(null);
  };

  // Get badge variant based on document status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="default" className="bg-success">
            <CheckCheck className="mr-1 h-3 w-3" /> Vérifié
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <X className="mr-1 h-3 w-3" /> Rejeté
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-warning text-warning">
            <AlertTriangle className="mr-1 h-3 w-3" /> En attente
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Vérification de documents
          </h1>
          <p className="text-muted-foreground">
            Validez les diplômes et certificats des étudiants
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Rapport d'analyse
        </Button>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par ID étudiant..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter || ""} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="verified">Vérifiés</SelectItem>
            <SelectItem value="rejected">Rejetés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Documents grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle className="flex items-center gap-1">
                    <FileCheck className="h-5 w-5" />
                    <span className="capitalize">{doc.type}</span>
                  </CardTitle>
                  <CardDescription>
                    Étudiant ID: {doc.studentId}
                  </CardDescription>
                </div>
                {getStatusBadge(doc.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div
                className="relative aspect-[4/3] rounded-md overflow-hidden bg-muted cursor-pointer"
                onClick={() => {
                  setSelectedDocument(doc);
                  setIsDialogOpen(true);
                }}
              >
                <img
                  src={doc.imageUrl}
                  alt={`Document ${doc.type}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="bg-white rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity">
                    <Search className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Upload date and OCR info */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Téléchargé le:</span>
                  <span>
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                {doc.ocrText && (
                  <div className="bg-muted p-2 rounded-md text-xs max-h-20 overflow-y-auto">
                    <p className="font-medium mb-1">Texte OCR détecté:</p>
                    <p className="whitespace-pre-line">{doc.ocrText}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {doc.status === "pending" ? (
                <div className="flex w-full gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedDocument(doc);
                      setIsDialogOpen(true);
                    }}
                  >
                    Examiner
                  </Button>
                  <Button className="flex-1">Vérifier</Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedDocument(doc);
                    setIsDialogOpen(true);
                  }}
                >
                  Détails
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}

        {filteredDocuments.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucun document</h3>
              <p className="text-muted-foreground">
                Aucun document ne correspond à votre recherche.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Document detail dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedDocument && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span className="capitalize">{selectedDocument.type}</span>
                {getStatusBadge(selectedDocument.status)}
              </DialogTitle>
              <DialogDescription>
                <div>Étudiant ID: {selectedDocument.studentId}</div>
                <div>
                  Téléchargé le:{" "}
                  {new Date(selectedDocument.uploadedAt).toLocaleDateString()}
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 flex flex-col gap-4">
              {/* Document image */}
              <div className="rounded-md overflow-hidden">
                <img
                  src={selectedDocument.imageUrl}
                  alt={`Document ${selectedDocument.type}`}
                  className="w-full h-auto max-h-80 object-contain bg-muted"
                />
              </div>

              {/* OCR Text */}
              {selectedDocument.ocrText && (
                <div>
                  <h4 className="font-medium mb-2">Texte détecté par OCR:</h4>
                  <div className="bg-muted p-4 rounded-md text-sm max-h-40 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-mono">
                      {selectedDocument.ocrText}
                    </pre>
                  </div>
                </div>
              )}

              {/* Verification history */}
              {selectedDocument.verifiedAt && (
                <div>
                  <h4 className="font-medium mb-2">Historique de vérification:</h4>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex justify-between text-sm">
                      <span>Vérifié par:</span>
                      <span>Admin #{selectedDocument.verifiedBy}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Date de vérification:</span>
                      <span>
                        {new Date(selectedDocument.verifiedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              {selectedDocument.status === "pending" ? (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => handleVerify(false)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Rejeter
                  </Button>
                  <Button onClick={() => handleVerify(true)}>
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Vérifier
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsDialogOpen(false)}>Fermer</Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default DocumentVerification;

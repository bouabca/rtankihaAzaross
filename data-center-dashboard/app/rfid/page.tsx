"use client"

import { useState, useEffect } from "react"
import { getRFIDCards, addRFIDCard, deleteRFIDCard, type RFIDCard } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { format, parseISO } from "date-fns"
import { KeyRound, Plus, RefreshCw, Trash2, User, Calendar, Shield } from "lucide-react"

export default function RFIDPage() {
  const [cards, setCards] = useState<RFIDCard[]>([])
  const [loading, setLoading] = useState(true)
  const [cardToDelete, setCardToDelete] = useState<string | null>(null)
  const [newCard, setNewCard] = useState({
    uid: "",
    name: "",
    access_level: 1,
    valid_from: format(new Date(), "yyyy-MM-dd"),
    valid_until: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), "yyyy-MM-dd"),
    allowed_devices: ["*"], // All devices
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCards()
  }, [])

  async function fetchCards() {
    try {
      setLoading(true)
      const data = await getRFIDCards()
      setCards(data)
    } catch (error) {
      console.error("Error fetching RFID cards:", error)
      toast({
        title: "Error",
        description: "Failed to load RFID cards. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleAddCard() {
    try {
      const response = await addRFIDCard(newCard)
      setCards([...cards, response])
      setDialogOpen(false)
      setNewCard({
        uid: "",
        name: "",
        access_level: 1,
        valid_from: format(new Date(), "yyyy-MM-dd"),
        valid_until: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), "yyyy-MM-dd"),
        allowed_devices: ["*"],
      })
      toast({
        title: "Success",
        description: "RFID card added successfully",
      })
    } catch (error) {
      console.error("Error adding RFID card:", error)
      toast({
        title: "Error",
        description: "Failed to add RFID card. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteCard() {
    if (!cardToDelete) return

    try {
      await deleteRFIDCard(cardToDelete)
      setCards(cards.filter((card) => card.card_id !== cardToDelete))
      toast({
        title: "Success",
        description: "RFID card deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting RFID card:", error)
      toast({
        title: "Error",
        description: "Failed to delete RFID card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCardToDelete(null)
    }
  }

  function getAccessLevelBadge(level: number) {
    switch (level) {
      case 3:
        return <Badge className="bg-red-500">Admin</Badge>
      case 2:
        return <Badge className="bg-amber-500">Manager</Badge>
      case 1:
      default:
        return <Badge>User</Badge>
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "expired":
        return <Badge variant="secondary">Expired</Badge>
      case "revoked":
        return <Badge variant="destructive">Revoked</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">RFID Cards</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New RFID Card</DialogTitle>
              <DialogDescription>Enter the details for the new RFID card.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="uid" className="text-right">
                  Card UID
                </Label>
                <Input
                  id="uid"
                  value={newCard.uid}
                  onChange={(e) => setNewCard({ ...newCard, uid: e.target.value })}
                  placeholder="a4:b5:c6:d7"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  User Name
                </Label>
                <Input
                  id="name"
                  value={newCard.name}
                  onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                  placeholder="John Doe"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="access_level" className="text-right">
                  Access Level
                </Label>
                <Input
                  id="access_level"
                  type="number"
                  min="1"
                  max="3"
                  value={newCard.access_level}
                  onChange={(e) => setNewCard({ ...newCard, access_level: Number.parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valid_from" className="text-right">
                  Valid From
                </Label>
                <Input
                  id="valid_from"
                  type="date"
                  value={newCard.valid_from}
                  onChange={(e) => setNewCard({ ...newCard, valid_from: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valid_until" className="text-right">
                  Valid Until
                </Label>
                <Input
                  id="valid_until"
                  type="date"
                  value={newCard.valid_until}
                  onChange={(e) => setNewCard({ ...newCard, valid_until: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCard}>Add Card</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authorized RFID Cards</CardTitle>
          <CardDescription>Manage RFID cards that have access to your datacenter</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Card UID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cards.map((card) => (
                  <TableRow key={card.card_id}>
                    <TableCell className="font-mono">
                      <div className="flex items-center space-x-2">
                        <KeyRound className="h-4 w-4 text-muted-foreground" />
                        <span>{card.uid}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{card.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        {getAccessLevelBadge(card.access_level)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(parseISO(card.valid_until), "MMM d, yyyy")}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(card.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setCardToDelete(card.card_id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {cards.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No RFID cards found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!cardToDelete} onOpenChange={(open) => !open && setCardToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the RFID card and revoke access for this card.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCard} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

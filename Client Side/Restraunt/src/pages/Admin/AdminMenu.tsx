import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { menuAPI, categoriesAPI } from '@/lib/api';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName?: string;
  imageUrl?: string;
  isAvailable: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface MenuForm {
  Name: string;
  description: string;
  price: string;
  categoryId: string;
  isAvailable: boolean;
  image: File | null;
}

const initialForm: MenuForm = {
  Name: '',
  description: '',
  price: '',
  categoryId: '',
  isAvailable: true,
  image: null,
};

export default function AdminMenu() {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<MenuForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menuRes, categoriesRes] = await Promise.all([
        menuAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setMenuItems(menuRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, image: file });
    }
  };

  const validateForm = () => {
    if (!form.Name.trim()) {
      toast({ title: 'Validation Error', description: 'Name is required', variant: 'destructive' });
      return false;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      toast({ title: 'Validation Error', description: 'Valid price is required', variant: 'destructive' });
      return false;
    }
    if (!form.categoryId) {
      toast({ title: 'Validation Error', description: 'Category is required', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.Name.trim());
      formData.append('description', form.description.trim());
      formData.append('price', form.price);
      formData.append('categoryId', form.categoryId);
      formData.append('isAvailable', String(form.isAvailable));
      if (form.image) {
        formData.append('imageurl', form.image);
      }

      await menuAPI.create(formData);
      toast({ title: 'Success', description: 'Menu item created successfully' });
      setAddModalOpen(false);
      setForm(initialForm);
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create menu item', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedItem || !validateForm()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.Name.trim());
      formData.append('description', form.description.trim());
      formData.append('price', form.price);
      formData.append('categoryId', form.categoryId);
      formData.append('isAvailable', String(form.isAvailable));
      if (form.image) {
        formData.append('imageurl', form.image);
      }

      await menuAPI.update(selectedItem.id, formData);
      toast({ title: 'Success', description: 'Menu item updated successfully' });
      setEditModalOpen(false);
      setSelectedItem(null);
      setForm(initialForm);
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update menu item', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    setSubmitting(true);
    try {
      await menuAPI.delete(selectedItem.id);
      toast({ title: 'Success', description: 'Menu item deleted successfully' });
      setDeleteDialogOpen(false);
      setSelectedItem(null);
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete menu item', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await menuAPI.toggleAvailability(item.id);
      setMenuItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i))
      );
      toast({
        title: 'Success',
        description: `${item.name} is now ${!item.isAvailable ? 'available' : 'unavailable'}`,
      });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update availability', variant: 'destructive' });
    }
  };

  const openEditModal = (item: MenuItem) => {
    setSelectedItem(item);
    setForm({
      Name: item.name,
      description: item.description || '',
      price: String(item.price),
      categoryId: item.categoryId,
      isAvailable: item.isAvailable,
      image: null,
    });
    setEditModalOpen(true);
  };

  const openDeleteDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu Items</h1>
          <p className="text-muted-foreground">Manage your restaurant menu</p>
        </div>
        <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                {/* <TableHead>Available</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">
                    {item.description || '-'}
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {getCategoryName(item.categoryId)}
                  </TableCell>
                  {/* <TableCell>
                    <Switch
                      checked={item.isAvailable}
                      onCheckedChange={() => handleToggleAvailability(item)}
                    />
                  </TableCell> */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {menuItems.length === 0 && (
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No menu items found</p>
            <Button className="mt-4 gap-2" onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Your First Menu Item
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Dialog
        open={addModalOpen || editModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setAddModalOpen(false);
            setEditModalOpen(false);
            setSelectedItem(null);
            setForm(initialForm);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editModalOpen ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
            <DialogDescription>
              {editModalOpen ? 'Update the menu item details' : 'Add a new item to your menu'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter item name"
                value={form.Name}
                onChange={(e) => setForm({ ...form, Name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter item description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={form.categoryId}
                onValueChange={(value) => setForm({ ...form, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {form.image && (
                <p className="text-sm text-muted-foreground">Selected: {form.image.name}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="availability">Available</Label>
              <Switch
                id="availability"
                checked={form.isAvailable}
                onCheckedChange={(checked) => setForm({ ...form, isAvailable: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddModalOpen(false);
                setEditModalOpen(false);
                setSelectedItem(null);
                setForm(initialForm);
              }}
            >
              Cancel
            </Button>
            <Button onClick={editModalOpen ? handleEdit : handleAdd} disabled={submitting}>
              {submitting ? 'Saving...' : editModalOpen ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

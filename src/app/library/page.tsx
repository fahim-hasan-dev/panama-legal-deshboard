"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useListQuery } from "@/hooks/useListQuery";
import { BookOpen, Plus, Trash2, FileText, FolderPlus, Eye, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardTable } from "@/components/shared/DashboardTable";
import { Pagination } from "@/components/shared/Pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

export default function LibraryPage() {
  const [categories, setCategories] = useState<any[]>([]);

  // View Library Details State
  const [viewingLib, setViewingLib] = useState<any | null>(null);

  // Add Library Item State
  const [showLibModal, setShowLibModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Edit Library Item State
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  // Category Modal State
  const [showCatModal, setShowCatModal] = useState(false);
  const [catTitle, setCatTitle] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [catImage, setCatImage] = useState<File | null>(null);

  // Edit Category State
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [editCatTitle, setEditCatTitle] = useState("");
  const [editCatDescription, setEditCatDescription] = useState("");
  const [editCatImage, setEditCatImage] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const {
    data: libraries,
    isLoading,
    page,
    setPage,
    totalPages,
    totalItems,
    refresh: refreshLibraries,
  } = useListQuery<any>({
    endpoint: "/library",
  });

  const loadCategories = async () => {
    try {
      const res = await api.get("/library-category");
      const list = res?.data?.categories || res?.data?.result || res?.data || [];
      setCategories(Array.isArray(list) ? list : []);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Create Library Document
  const handleCreateLibraryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !selectedCategory) {
      toast.error("Please fill in title, description, and select a category.");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category: selectedCategory,
        })
      );
      if (file) {
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
          toast.error("Only PDF documents (.pdf) are allowed for file upload.");
          setSubmitting(false);
          return;
        }
        formData.append("file", file);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.post("/library", formData);
      toast.success("Library document uploaded successfully!");
      setShowLibModal(false);
      setTitle("");
      setDescription("");
      setSelectedCategory("");
      setFile(null);
      setImageFile(null);
      refreshLibraries();
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload library document");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Library Item Modal
  const openEditItemModal = (item: any) => {
    setEditingItem(item);
    setEditTitle(item.title || "");
    setEditDescription(item.description || "");
    const catId = typeof item.category === "object" ? item.category?._id : item.category;
    setEditCategory(catId || "");
    setEditFile(null);
    setEditImageFile(null);
  };

  // Update Library Document
  const handleUpdateLibraryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
          category: editCategory,
        })
      );
      if (editFile) {
        if (editFile.type !== "application/pdf" && !editFile.name.toLowerCase().endsWith(".pdf")) {
          toast.error("Only PDF documents (.pdf) are allowed for file upload.");
          setSubmitting(false);
          return;
        }
        formData.append("file", editFile);
      }
      if (editImageFile) {
        formData.append("image", editImageFile);
      }

      await api.patch(`/library/${editingItem._id || editingItem.id}`, formData);
      toast.success("Library document updated successfully!");
      setEditingItem(null);
      refreshLibraries();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update library document");
    } finally {
      setSubmitting(false);
    }
  };

  // Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catTitle.trim() || !catDescription.trim()) {
      toast.error("Category title and description are required.");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          title: catTitle.trim(),
          description: catDescription.trim(),
        })
      );
      if (catImage) {
        formData.append("image", catImage);
      }

      await api.post("/library-category", formData);
      toast.success("Category created successfully!");
      setShowCatModal(false);
      setCatTitle("");
      setCatDescription("");
      setCatImage(null);
      loadCategories();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Category Modal
  const openEditCatModal = (cat: any) => {
    setEditingCat(cat);
    setEditCatTitle(cat.title || cat.name || "");
    setEditCatDescription(cat.description || "");
    setEditCatImage(null);
  };

  // Update Category
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          title: editCatTitle.trim(),
          description: editCatDescription.trim(),
        })
      );
      if (editCatImage) {
        formData.append("image", editCatImage);
      }

      await api.patch(`/library-category/${editingCat._id || editingCat.id}`, formData);
      toast.success("Category updated successfully!");
      setEditingCat(null);
      loadCategories();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLibraryItem = async (id: string) => {
    try {
      await api.delete(`/library/${id}`);
      toast.success("Library document deleted successfully");
      refreshLibraries();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete document");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.delete(`/library-category/${id}`);
      toast.success("Category deleted successfully");
      loadCategories();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete category");
    }
  };

  const columns = [
    {
      header: "Document Title",
      cell: (lib: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#2E5089] border border-slate-200 flex items-center justify-center font-bold shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-900 text-sm">{lib.title}</span>
        </div>
      ),
    },
    {
      header: "Category",
      cell: (lib: any) => {
        const catName =
          lib.category?.title ||
          lib.category?.name ||
          (typeof lib.category === "string" ? lib.category : "General");
        return (
          <Badge variant="outline" className="bg-slate-100 font-semibold text-slate-700">
            {catName}
          </Badge>
        );
      },
    },
    {
      header: "Description",
      cell: (lib: any) => (
        <span className="text-xs text-slate-600 max-w-xs truncate block">
          {lib.description || "N/A"}
        </span>
      ),
    },
    {
      header: "Uploaded Date",
      cell: (lib: any) => (
        <span className="text-xs text-slate-500">
          {lib.createdAt ? new Date(lib.createdAt).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (lib: any) => {
        const fileUrl = lib.file
          ? lib.file.startsWith("http")
            ? lib.file
            : `${process.env.NEXT_PUBLIC_SERVER_URL || "http://10.10.26.182:5001"}${lib.file}`
          : null;
        return (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewingLib(lib)}
              className="h-8 px-2.5 gap-1 text-xs text-[#2E5089] hover:bg-[#2E5089]/10"
              title="View Document Details"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditItemModal(lib)}
              className="h-8 w-8 p-0 text-slate-600 hover:text-[#2E5089]"
              title="Edit document"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteLibraryItem(lib._id || lib.id)}
              className="h-8 w-8 p-0"
              title="Delete document"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#16253E] tracking-tight">Legal Library & Knowledge Center</h1>
          <p className="text-xs text-slate-500 font-normal">Manage legal codes, PDF documents, executive decrees, and category taxonomy.</p>
        </div>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="documents" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Library Documents ({totalItems})</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <FolderPlus className="w-4 h-4" />
              <span>Categories ({categories.length})</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button onClick={() => setShowCatModal(true)} variant="outline" className="text-xs font-semibold gap-1.5">
              <FolderPlus className="w-4 h-4 text-[#2E5089]" />
              Add Category
            </Button>
            <Button onClick={() => setShowLibModal(true)} className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold text-xs gap-1.5">
              <Plus className="w-4 h-4" />
              Upload Document
            </Button>
          </div>
        </div>

        <TabsContent value="documents" className="mt-6 space-y-4">
          <DashboardTable
            data={libraries}
            columns={columns}
            loading={isLoading}
            emptyText="No library documents uploaded yet."
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">No library categories created yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const imgUrl = cat.image
                  ? cat.image.startsWith("http")
                    ? cat.image
                    : `${process.env.NEXT_PUBLIC_SERVER_URL || "http://10.10.26.182:5001"}${cat.image}`
                  : null;
                return (
                  <Card key={cat._id || cat.id} className="shadow-xs hover:border-slate-300 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={cat.title || cat.name}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-[#2E5089]/10 text-[#2E5089] flex items-center justify-center font-bold">
                            <FolderPlus className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">{cat.title || cat.name}</h4>
                          <p className="text-[11px] text-slate-500 max-w-xs truncate">{cat.description || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditCatModal(cat)}
                          className="text-slate-600 hover:text-[#2E5089] h-8 w-8 p-0"
                          title="Edit Category"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(cat._id || cat.id)}
                          className="text-red-500 hover:bg-red-50 h-8 w-8 p-0 shrink-0"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Upload Document Modal */}
      <Dialog open={showLibModal} onOpenChange={setShowLibModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Legal Resource</DialogTitle>
            <DialogDescription>Add a new code, regulation, or legal guide to the library</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLibraryItem} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Document Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Labour Law Code 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.title || c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Brief summary of what this legal document covers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">PDF Document / File</label>
              <Input
                type="file"
                accept="application/pdf, .pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="cursor-pointer text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Cover Image / Thumbnail (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="cursor-pointer text-xs"
              />
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowLibModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold">
                {submitting ? "Uploading..." : "Upload Document"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Document Modal */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Legal Document</DialogTitle>
            <DialogDescription>Update document metadata, category, or files</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateLibraryItem} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Document Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Document Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.title || c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Description..."
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Replace PDF File (Optional)</label>
              <Input
                type="file"
                accept="application/pdf, .pdf"
                onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                className="cursor-pointer text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Replace Cover Image (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                className="cursor-pointer text-xs"
              />
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold">
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Category Modal */}
      <Dialog open={showCatModal} onOpenChange={setShowCatModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Library Category</DialogTitle>
            <DialogDescription>Taxonomy category for legal code organization</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCategory} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Category Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Maritime Law"
                value={catTitle}
                onChange={(e) => setCatTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Category Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Description for this category..."
                value={catDescription}
                onChange={(e) => setCatDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Category Image / Icon (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setCatImage(e.target.files?.[0] || null)}
                className="cursor-pointer text-xs"
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowCatModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold">
                {submitting ? "Saving..." : "Save Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={!!editingCat} onOpenChange={(open) => !open && setEditingCat(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Library Category</DialogTitle>
            <DialogDescription>Update category name or description</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateCategory} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Category Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Category Title"
                value={editCatTitle}
                onChange={(e) => setEditCatTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Category Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Description..."
                value={editCatDescription}
                onChange={(e) => setEditCatDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Replace Category Image (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setEditCatImage(e.target.files?.[0] || null)}
                className="cursor-pointer text-xs"
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setEditingCat(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold">
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Library Document Details Modal */}
      <Dialog open={!!viewingLib} onOpenChange={(open) => !open && setViewingLib(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-[#2E5089]/10 text-[#2E5089] border-[#2E5089]/20 font-semibold">
                {viewingLib?.category?.title || viewingLib?.category?.name || (typeof viewingLib?.category === "string" ? viewingLib?.category : "General")}
              </Badge>
              <span className="text-xs text-slate-500">
                Uploaded: {viewingLib?.createdAt ? new Date(viewingLib.createdAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <DialogTitle className="text-xl font-bold text-[#16253E]">
              {viewingLib?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {viewingLib?.image && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-44 w-full">
                <img
                  src={
                    viewingLib.image.startsWith("http")
                      ? viewingLib.image
                      : `${process.env.NEXT_PUBLIC_SERVER_URL || "http://10.10.26.182:5001"}${viewingLib.image}`
                  }
                  alt={viewingLib.title}
                  className="w-full h-44 object-cover"
                />
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description / Summary</h4>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                {viewingLib?.description || "No description provided."}
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4 flex items-center justify-between gap-2">
            <div>
              {viewingLib?.file && (
                <a
                  href={
                    viewingLib.file.startsWith("http")
                      ? viewingLib.file
                      : `${process.env.NEXT_PUBLIC_SERVER_URL || "http://10.10.26.182:5001"}${viewingLib.file}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button className="bg-[#2E5089] hover:bg-[#244172] text-white text-xs font-semibold gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Open PDF Document</span>
                  </Button>
                </a>
              )}
            </div>
            <Button variant="outline" onClick={() => setViewingLib(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

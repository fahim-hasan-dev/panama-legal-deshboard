"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useListQuery } from "@/hooks/useListQuery";
import { FileText, Plus, Trash2, FolderPlus, Pencil, Eye } from "lucide-react";
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

export default function ArticlesPage() {
  const [categories, setCategories] = useState<any[]>([]);

  // View Article Details State
  const [viewingArticle, setViewingArticle] = useState<any | null>(null);

  // Create Article State
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // Edit Article State
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  // Category State
  const [showCatModal, setShowCatModal] = useState(false);
  const [catName, setCatName] = useState("");

  // Edit Category State
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [editCatTitle, setEditCatTitle] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const {
    data: articles,
    isLoading,
    page,
    setPage,
    totalPages,
    totalItems,
    refresh: refreshArticles,
  } = useListQuery<any>({
    endpoint: "/article",
  });

  const loadCategories = async () => {
    try {
      const res = await api.get("/article-category");
      const list = res?.data?.categories || res?.data?.result || res?.data || [];
      setCategories(Array.isArray(list) ? list : []);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Create Article
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !selectedCategory) {
      toast.error("Please fill in title, content, and category.");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          title: title.trim(),
          description: content.trim(),
          category: selectedCategory,
        })
      );
      if (image) {
        formData.append("image", image);
      }

      await api.post("/article", formData);
      toast.success("Article created successfully!");
      setShowArticleModal(false);
      setTitle("");
      setContent("");
      setSelectedCategory("");
      setImage(null);
      refreshArticles();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create article");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Article Modal
  const openEditArticleModal = (art: any) => {
    setEditingArticle(art);
    setEditTitle(art.title || "");
    setEditContent(art.description || art.content || "");
    const catId = typeof art.category === "object" ? art.category?._id : art.category;
    setEditCategory(catId || "");
    setEditImage(null);
  };

  // Update Article
  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          title: editTitle.trim(),
          description: editContent.trim(),
          category: editCategory,
        })
      );
      if (editImage) {
        formData.append("image", editImage);
      }

      await api.patch(`/article/${editingArticle._id || editingArticle.id}`, formData);
      toast.success("Article updated successfully!");
      setEditingArticle(null);
      refreshArticles();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update article");
    } finally {
      setSubmitting(false);
    }
  };

  // Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    try {
      await api.post("/article-category", { title: catName.trim() });
      toast.success("Article category created!");
      setShowCatModal(false);
      setCatName("");
      loadCategories();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create article category");
    }
  };

  // Open Edit Category Modal
  const openEditCatModal = (cat: any) => {
    setEditingCat(cat);
    setEditCatTitle(cat.title || cat.name || "");
  };

  // Update Category
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editCatTitle.trim()) return;
    setSubmitting(true);
    try {
      await api.patch(`/article-category/${editingCat._id || editingCat.id}`, {
        title: editCatTitle.trim(),
      });
      toast.success("Article category updated!");
      setEditingCat(null);
      loadCategories();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await api.delete(`/article/${id}`);
      toast.success("Article deleted");
      refreshArticles();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete article");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.delete(`/article-category/${id}`);
      toast.success("Article category deleted");
      loadCategories();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete category");
    }
  };

  const columns = [
    {
      header: "Article Title",
      cell: (art: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2E5089]/10 text-[#2E5089] border border-[#2E5089]/20 flex items-center justify-center font-bold shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-900 text-sm">{art.title}</span>
        </div>
      ),
    },
    {
      header: "Category",
      cell: (art: any) => {
        const categoryName =
          art.category?.title ||
          art.category?.name ||
          (typeof art.category === "string" ? art.category : "General");
        return (
          <Badge variant="outline" className="bg-slate-100 font-semibold text-slate-700">
            {categoryName}
          </Badge>
        );
      },
    },
    {
      header: "Excerpt",
      cell: (art: any) => (
        <span className="text-xs text-slate-600 max-w-xs truncate block">
          {art.description || art.content || "N/A"}
        </span>
      ),
    },
    {
      header: "Date Published",
      cell: (art: any) => (
        <span className="text-xs text-slate-500">
          {art.createdAt ? new Date(art.createdAt).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (art: any) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewingArticle(art)}
            className="h-8 px-2.5 gap-1 text-xs text-[#2E5089] hover:bg-[#2E5089]/10"
            title="View Article Details"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditArticleModal(art)}
            className="h-8 w-8 p-0 text-slate-600 hover:text-[#2E5089]"
            title="Edit Article"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteArticle(art._id || art.id)}
            className="h-8 w-8 p-0"
            title="Delete article"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#16253E] tracking-tight">Articles & Legal Insights</h1>
          <p className="text-xs text-slate-500 font-normal">Publish educational articles, legal updates, news, and manage blog categories.</p>
        </div>
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="articles" className="gap-2">
              <FileText className="w-4 h-4" />
              <span>Articles & Blogs</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <FolderPlus className="w-4 h-4" />
              <span>Article Categories ({categories.length})</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button onClick={() => setShowCatModal(true)} variant="outline" className="text-xs font-semibold gap-1.5">
              <FolderPlus className="w-4 h-4 text-[#2E5089]" />
              Add Category
            </Button>
            <Button onClick={() => setShowArticleModal(true)} className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold text-xs gap-1.5">
              <Plus className="w-4 h-4" />
              Write Article
            </Button>
          </div>
        </div>

        <TabsContent value="articles" className="mt-6 space-y-4">
          <DashboardTable
            data={articles}
            columns={columns}
            loading={isLoading}
            emptyText="No articles published yet."
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
            <div className="text-center py-12 text-slate-500 text-sm">No article categories created yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Card key={cat._id || cat.id} className="shadow-xs hover:border-slate-300 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2E5089]/10 text-[#2E5089] flex items-center justify-center font-bold">
                        <FolderPlus className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-900 text-sm">{cat.title || cat.name}</span>
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
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Article Details Modal */}
      <Dialog open={!!viewingArticle} onOpenChange={(open) => !open && setViewingArticle(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-[#2E5089]/10 text-[#2E5089] border-[#2E5089]/20 font-semibold">
                {viewingArticle?.category?.title || viewingArticle?.category?.name || "General"}
              </Badge>
              <span className="text-xs text-slate-500">
                Published: {viewingArticle?.createdAt ? new Date(viewingArticle.createdAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <DialogTitle className="text-xl font-bold text-[#16253E]">
              {viewingArticle?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {viewingArticle?.image && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-44 w-full">
                <img
                  src={
                    viewingArticle.image.startsWith("http")
                      ? viewingArticle.image
                      : `${process.env.NEXT_PUBLIC_SERVER_URL || "http://10.10.26.182:5001"}${viewingArticle.image}`
                  }
                  alt={viewingArticle.title}
                  className="w-full h-44 object-cover"
                />
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Article Body</h4>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                {viewingArticle?.description || viewingArticle?.content || "No content available."}
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setViewingArticle(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Article Modal */}
      <Dialog open={showArticleModal} onOpenChange={setShowArticleModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Write New Article</DialogTitle>
            <DialogDescription>Publish news, legal updates, or educational articles</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateArticle} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Article Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Understanding Labor Rights in Panama"
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
                Article Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Write full article body..."
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Featured Image (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="cursor-pointer text-xs"
              />
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowArticleModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold">
                {submitting ? "Publishing..." : "Publish Article"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Article Modal */}
      <Dialog open={!!editingArticle} onOpenChange={(open) => !open && setEditingArticle(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
            <DialogDescription>Update title, category, content, or featured image</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateArticle} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Article Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Article Title"
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
                Article Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Article Content..."
                rows={6}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Replace Featured Image (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                className="cursor-pointer text-xs"
              />
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setEditingArticle(null)}>
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
            <DialogTitle>Add Article Category</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateCategory} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Category Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Constitutional Amendments"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowCatModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2E5089] hover:bg-[#244172] text-white font-semibold">
                Save Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={!!editingCat} onOpenChange={(open) => !open && setEditingCat(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Article Category</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdateCategory} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Category Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Category Name"
                value={editCatTitle}
                onChange={(e) => setEditCatTitle(e.target.value)}
                required
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
    </div>
  );
}

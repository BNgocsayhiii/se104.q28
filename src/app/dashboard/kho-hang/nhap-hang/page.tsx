'use client'

import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useWarehouseImport, DraftSupplier, DraftProduct } from '@/hooks/useWarehouseImport'

interface SupplierSmartInputProps {
  suppliers: any[]
  draftSupplier: DraftSupplier
  onChange: (supplier: DraftSupplier) => void
}

function SupplierSmartInput({ suppliers, draftSupplier, onChange }: SupplierSmartInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = useMemo(() => {
    if (!draftSupplier.name.trim() || draftSupplier.id) return suppliers
    return suppliers.filter(s => s.name.toLowerCase().includes(draftSupplier.name.toLowerCase()))
  }, [suppliers, draftSupplier.name, draftSupplier.id])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange({ ...draftSupplier, id: '', name: value })
    setIsOpen(true)
  }

  const handleSelect = (supplier: any) => {
    onChange({
      id: supplier.id,
      name: supplier.name,
      phone: supplier.phone || '',
      address: supplier.address || '',
      contactPerson: supplier.contactPerson || ''
    })
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative mb-4">
      <label className="block text-xs font-black uppercase text-slate-600 mb-1">Nhà cung cấp đối tác</label>
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-[#60A61F]"
          placeholder="Gõ tên nhà cung cấp (chọn hoặc tạo mới)..."
          value={draftSupplier.name}
          onChange={handleTextChange}
          onFocus={() => setIsOpen(true)}
        />
        {draftSupplier.id && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
            Đã chọn đối tác cũ
          </span>
        )}
      </div>

      {isOpen && !draftSupplier.id && draftSupplier.name && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl">
          {filtered.map(supplier => (
            <div
              key={supplier.id}
              className="cursor-pointer px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-[#1a4d2e]"
              onClick={() => handleSelect(supplier)}
            >
              {supplier.name} {supplier.phone ? `(${supplier.phone})` : ''}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-3 text-xs font-bold text-slate-500 text-center">
              Chưa có đối tác này. Tiếp tục điền thông tin bên dưới để tạo mới.
            </div>
          )}
        </div>
      )}

      {!draftSupplier.id && draftSupplier.name && (
        <div className="mt-2 grid gap-2 sm:grid-cols-2 rounded-xl bg-slate-50 p-3 border border-slate-200 border-dashed">
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-[#60A61F]" placeholder="Số điện thoại" value={draftSupplier.phone} onChange={e => onChange({ ...draftSupplier, phone: e.target.value })} />
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-[#60A61F]" placeholder="Người đại diện" value={draftSupplier.contactPerson} onChange={e => onChange({ ...draftSupplier, contactPerson: e.target.value })} />
          <input className="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-[#60A61F]" placeholder="Địa chỉ đối tác" value={draftSupplier.address} onChange={e => onChange({ ...draftSupplier, address: e.target.value })} />
        </div>
      )}
    </div>
  )
}

interface ProductSmartInputProps {
  products: any[]
  categories: any[]
  draftProduct: DraftProduct
  onChange: (product: DraftProduct) => void
}

function ProductSmartInput({ products, categories, draftProduct, onChange }: ProductSmartInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = useMemo(() => {
    if (!draftProduct.name.trim() || draftProduct.id) return products
    return products.filter(p => p.name.toLowerCase().includes(draftProduct.name.toLowerCase()) || p.sku.toLowerCase().includes(draftProduct.name.toLowerCase()))
  }, [products, draftProduct.name, draftProduct.id])

  return (
    <div ref={containerRef} className="relative w-full mb-3">
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-[#60A61F]"
          placeholder="Gõ tìm trái cây có sẵn hoặc tạo mặt hàng mới..."
          value={draftProduct.name}
          onChange={(e) => {
            onChange({ ...draftProduct, id: '', name: e.target.value })
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              e.preventDefault()
              setIsOpen(false)
            }
          }}
        />
        {draftProduct.id && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
            Đã chọn hàng cũ
          </span>
        )}
      </div>

      {isOpen && !draftProduct.id && draftProduct.name && (
        <div className="absolute z-40 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl">
          {filtered.map(p => (
            <div
              key={p.id}
              className="cursor-pointer px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-green-50"
              onClick={() => {
                onChange({ ...draftProduct, id: p.id, name: `${p.name} - ${p.sku}`, shelfLifeDays: p.shelfLifeDays.toString(), currentPrice: String(p.currentPrice || '') })
                setIsOpen(false)
              }}
            >
              {p.name} <span className="text-xs text-slate-400">({p.sku})</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-3 text-center text-xs font-bold text-slate-400">
              Mặt hàng mới. Vui lòng nhập thông tin phía dưới.
            </div>
          )}
        </div>
      )}

      {/* COMPONENT ĐÃ ĐƯỢC CHỈNH SỬA LẠI (Chỉ còn HSD và Danh mục) */}
      {!draftProduct.id && draftProduct.name && (
        <div className="mt-2 grid gap-3 md:grid-cols-2 rounded-xl bg-orange-50/40 p-3 border border-orange-200 border-dashed">
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase text-orange-600">Hạn sử dụng (Ngày)</label>
            <input 
              className="w-full rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 bg-white" 
              type="number" 
              placeholder="VD: 5" 
              value={draftProduct.shelfLifeDays} 
              onChange={e => onChange({ ...draftProduct, shelfLifeDays: e.target.value })} 
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase text-orange-600">Danh mục trái cây</label>
            <select 
              className="w-full rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 bg-white" 
              value={draftProduct.categoryId} 
              onChange={e => onChange({ ...draftProduct, categoryId: e.target.value })}
            >
              <option value="">Chọn danh mục...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TrangNhapHang() {
  const { data, draft, historyFilter, loading, submitting, error, successMessage, setDraft, setHistoryFilter, createImport } = useWarehouseImport()
  
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null)

  const estimatedTotal = useMemo(() => draft.lines.reduce((sum, line) => sum + Number(line.quantity || 0) * Number(line.importPrice || 0), 0), [draft.lines])
  const estimatedRevenue = useMemo(() => draft.lines.reduce((sum, line) => sum + Number(line.quantity || 0) * Number(line.sellPrice || line.product.currentPrice || 0), 0), [draft.lines])
  const estimatedProfit = estimatedRevenue - estimatedTotal

  const updateLine = (index: number, patch: Partial<typeof draft.lines[number]>) => {
    setDraft({ ...draft, lines: draft.lines.map((line, lineIndex) => lineIndex === index ? { ...line, ...patch } : line) })
  }

  const addLine = () => setDraft({ ...draft, lines: [...draft.lines, { product: { id: '', name: '', sku: '', unit: 'kg', shelfLifeDays: '5', currentPrice: '', categoryId: '' }, quantity: '', importPrice: '', sellPrice: '', packagedAt: new Date().toISOString().slice(0, 10) }] })
  const removeLine = (index: number) => draft.lines.length > 1 && setDraft({ ...draft, lines: draft.lines.filter((_, lineIndex) => lineIndex !== index) })

  return (
    <div className="h-[calc(100vh-32px)] overflow-hidden p-4 text-slate-800 relative">
      <div className="mx-auto flex h-full max-w-[1400px] gap-6 relative z-10">
        
        {/* === CỘT TRÁI: FORM NHẬP HÀNG === */}
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-black uppercase text-[#1a4d2e]">Nhập hàng</h1>
              <p className="mt-1 text-sm font-semibold text-slate-600">Gõ tên tìm kiếm, nếu chưa có hệ thống tự động khởi tạo.</p>
            </div>
          </div>

          {(error || successMessage) && (
            <div className={`rounded-xl border px-4 py-3 text-sm font-bold ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
              {error || successMessage}
            </div>
          )}

          <section className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
            <SupplierSmartInput 
              suppliers={data?.suppliers || []} 
              draftSupplier={draft.supplier} 
              onChange={(sup) => setDraft({ ...draft, supplier: sup })} 
            />

            <div className="mb-4 mt-6 flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-[#1a4d2e]">Danh sách lô hàng</h2>
              <button type="button" onClick={addLine} className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-black text-[#1a4d2e] hover:bg-green-100">+ Thêm dòng</button>
            </div>

            <div className="space-y-4">
              {draft.lines.map((line, index) => (
                <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-600">Dòng {index + 1}</span>
                    {draft.lines.length > 1 && <button type="button" onClick={() => removeLine(index)} className="text-xs font-bold text-red-600 hover:underline">Xóa dòng</button>}
                  </div>

                  <ProductSmartInput 
                    products={data?.products || []} 
                    categories={data?.categories || []}
                    draftProduct={line.product}
                    onChange={(prod) => updateLine(index, { product: prod, sellPrice: prod.currentPrice || line.sellPrice })}
                  />

                  <div className="grid gap-2 md:grid-cols-4">
                    <input className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-[#60A61F]" type="number" min="0" step="0.1" placeholder="Số lượng nhập (kg)" value={line.quantity} onChange={(e) => updateLine(index, { quantity: e.target.value })} />
                    <input className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-[#60A61F]" type="number" min="0" placeholder="Giá nhập (VNĐ)" value={line.importPrice} onChange={(e) => updateLine(index, { importPrice: e.target.value })} />
                    <input className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-[#60A61F]" type="number" min="0" placeholder="Giá bán (VNĐ)" value={line.sellPrice} onChange={(e) => updateLine(index, { sellPrice: e.target.value, product: { ...line.product, currentPrice: e.target.value } })} />
                    <input className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-[#60A61F]" type="date" title="Ngày đóng gói/nhập" value={line.packagedAt} onChange={(e) => updateLine(index, { packagedAt: e.target.value })} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <input className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-[#60A61F]" placeholder="Ghi chú phiếu nhập..." value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} />
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl bg-lime-700 p-4 text-white shadow-xl">
              <div>
                <p className="text-xs font-bold uppercase text-slate-300">Dự kiến tổng chi</p>
                <p className="text-2xl font-black">{new Intl.NumberFormat('vi-VN').format(estimatedTotal)} ₫</p>
                <p className="mt-1 text-xs font-bold text-lime-100">Lãi dự kiến: {new Intl.NumberFormat('vi-VN').format(estimatedProfit)} VNĐ</p>
              </div>
              <button
                className="rounded-xl bg-gradient-to-r from-lime-500 to-pink-300 px-8 py-3 text-sm font-black uppercase tracking-wider text-white shadow-xl transition-colors duration-200 hover:from-lime-400 hover:via-fuchsia-200 hover:to-pink-200 disabled:opacity-50"
                onClick={createImport}
                disabled={submitting}
              >
                {submitting ? 'Đang lưu...' : 'Hoàn tất Nhập Hàng'}
              </button>
            </div>
          </section>
        </div>

        {/* === CỘT PHẢI: LỊCH SỬ NHẬP HÀNG === */}
        <div className="hidden w-[400px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm lg:flex">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black uppercase text-[#1a4d2e]">Lịch sử nhập</h2>
            <input 
              type="month" 
              className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold outline-none focus:border-[#60A61F]"
              value={historyFilter.filterValue}
              onChange={(e) => setHistoryFilter({ filterType: 'month', filterValue: e.target.value })}
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
              <p className="text-xs font-bold text-slate-500">Tổng chi tháng</p>
              <p className="text-lg font-black text-slate-800">{new Intl.NumberFormat('vi-VN').format(data?.summary?.monthCost || 0)} ₫</p>
            </div>
            <div className="rounded-xl bg-green-50 p-3 border border-green-100">
              <p className="text-xs font-bold text-green-600">Số phiếu nhập</p>
              <p className="text-lg font-black text-green-800">{data?.summary?.receiptCount || 0} phiếu</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {loading ? (
              <p className="text-center text-sm font-semibold text-slate-500 mt-10">Đang tải lịch sử...</p>
            ) : data?.receipts && data.receipts.length > 0 ? (
              <div className="space-y-3">
                {data.receipts.map(receipt => (
                  <div 
                    key={receipt.id} 
                    onClick={() => setSelectedReceipt(receipt)}
                    className="cursor-pointer rounded-xl border border-slate-200 p-3 transition hover:border-[#60A61F] hover:shadow-md hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-black text-[#1a4d2e]">{receipt.receiptCode}</span>
                      <span className="text-sm font-black text-slate-800">
                        {new Intl.NumberFormat('vi-VN').format(receipt.totalAmount)} ₫
                      </span>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-600 truncate" title={receipt.supplierName}>
                      {receipt.supplierName}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs font-medium text-slate-500">
                      <span>{new Date(receipt.createdAt).toLocaleDateString('vi-VN')} {new Date(receipt.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5">{receipt.batches.length} mặt hàng</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm font-semibold text-slate-500 mt-10">Không có dữ liệu nhập hàng tháng này.</p>
            )}
          </div>
        </div>
      </div>

      {/* POPUP CHI TIẾT */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh]">
            <div className="flex items-center justify-between bg-[#1a4d2e] px-6 py-4 text-white">
              <h3 className="text-lg font-bold">Chi tiết Phiếu Nhập: {selectedReceipt.receiptCode}</h3>
              <button 
                onClick={() => setSelectedReceipt(null)} 
                className="text-2xl leading-none hover:text-gray-300 transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-slate-500 font-medium">Nhà cung cấp:</p>
                  <p className="font-bold text-slate-800">{selectedReceipt.supplierName}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Người lập phiếu:</p>
                  <p className="font-bold text-slate-800">{selectedReceipt.receivedByName}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Ngày lập:</p>
                  <p className="font-bold text-slate-800">
                    {new Date(selectedReceipt.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Tổng tiền:</p>
                  <p className="font-black text-lime-700 text-base">
                    {new Intl.NumberFormat('vi-VN').format(selectedReceipt.totalAmount)} ₫
                  </p>
                </div>
                {selectedReceipt.note && (
                  <div className="col-span-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                    <p className="text-slate-500 font-medium text-xs mb-1">Ghi chú:</p>
                    <p className="text-slate-800 italic">{selectedReceipt.note}</p>
                  </div>
                )}
              </div>

              <h4 className="font-bold text-[#1a4d2e] border-b pb-2 mb-3">Danh sách mặt hàng nhập</h4>
              <div className="space-y-3">
                {selectedReceipt.batches?.map((batch: any) => (
                  <div key={batch.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-slate-800">{batch.productName}</p>
                        <p className="text-xs text-slate-500">Mã lô: {batch.batchCode}</p>
                      </div>
                      <p className="font-bold text-slate-800 text-sm">
                        {new Intl.NumberFormat('vi-VN').format(batch.quantity * batch.importPrice)} ₫
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 mt-2 bg-white p-2 rounded-lg border border-slate-100">
                      <p>SL: <b>{batch.quantity} {batch.unit}</b></p>
                      <p>Đơn giá: <b>{new Intl.NumberFormat('vi-VN').format(batch.importPrice)} ₫</b></p>
                      <p>HSD: <b>{new Date(batch.expiredAt).toLocaleDateString('vi-VN')}</b></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t flex justify-end">
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="px-6 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
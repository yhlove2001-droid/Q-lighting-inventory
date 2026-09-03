import { supabase } from "./supabaseClient";

// ---------- profiles (회원) ----------
export async function fetchMyProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) { console.error(error); return null; }
  return data;
}
export async function fetchAllProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) { console.error(error); return []; }
  return data;
}
export async function approveProfile(id) {
  const { error } = await supabase.from("profiles").update({ status: "approved" }).eq("id", id);
  if (error) throw error;
}
export async function rejectProfile(id) {
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw error;
}

// ---------- vendors (거래처) ----------
function rowToVendor(r) {
  return {
    id: r.id, name: r.name, contact: r.contact || "", phone: r.phone || "",
    email: r.email || "", address: r.address || "", note: r.note || "", createdAt: r.created_at,
  };
}
export async function fetchVendors() {
  const { data, error } = await supabase.from("vendors").select("*").order("created_at", { ascending: true });
  if (error) { console.error(error); return []; }
  return data.map(rowToVendor);
}
export async function insertVendor(v) {
  const { data, error } = await supabase.from("vendors").insert({
    name: v.name, contact: v.contact, phone: v.phone, email: v.email, address: v.address, note: v.note,
  }).select().single();
  if (error) throw error;
  return rowToVendor(data);
}
export async function updateVendor(id, v) {
  const { data, error } = await supabase.from("vendors").update({
    name: v.name, contact: v.contact, phone: v.phone, email: v.email, address: v.address, note: v.note,
  }).eq("id", id).select().single();
  if (error) throw error;
  return rowToVendor(data);
}
export async function deleteVendorRow(id) {
  const { error } = await supabase.from("vendors").delete().eq("id", id);
  if (error) throw error;
}

// ---------- items (품목) ----------
function rowToItem(r) {
  return {
    id: r.id, name: r.name, location: r.location || "", unit: r.unit || "EA",
    note: r.note || "", createdAt: r.created_at,
  };
}
export async function fetchItems() {
  const { data, error } = await supabase.from("items").select("*").order("created_at", { ascending: true });
  if (error) { console.error(error); return []; }
  return data.map(rowToItem);
}
export async function insertItem(it) {
  const { data, error } = await supabase.from("items").insert({
    name: it.name, location: it.location, unit: it.unit, note: it.note,
  }).select().single();
  if (error) throw error;
  return rowToItem(data);
}
export async function updateItem(id, it) {
  const { data, error } = await supabase.from("items").update({
    name: it.name, location: it.location, unit: it.unit, note: it.note,
  }).eq("id", id).select().single();
  if (error) throw error;
  return rowToItem(data);
}
export async function deleteItemRow(id) {
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw error;
}

// ---------- transactions (입출고) ----------
function rowToTx(r) {
  return {
    id: r.id, itemId: r.item_id, type: r.type, outType: r.out_type || null,
    qty: Number(r.qty), unit: r.unit || null, date: r.date, vendorId: r.vendor_id || null, projectId: r.project_id || null,
    note: r.note || "", createdAt: r.created_at,
  };
}
export async function fetchTransactions() {
  const { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: false });
  if (error) { console.error(error); return []; }
  return data.map(rowToTx);
}
export async function insertTransaction(t) {
  const { data, error } = await supabase.from("transactions").insert({
    item_id: t.itemId, type: t.type, out_type: t.type === "out" ? t.outType : null,
    qty: t.qty, unit: t.unit || null, date: t.date || null, vendor_id: t.vendorId || null, project_id: t.projectId || null, note: t.note,
  }).select().single();
  if (error) throw error;
  return rowToTx(data);
}
export async function updateTransaction(id, t) {
  const { data, error } = await supabase.from("transactions").update({
    item_id: t.itemId, type: t.type, out_type: t.type === "out" ? t.outType : null,
    qty: t.qty, unit: t.unit || null, date: t.date || null, vendor_id: t.vendorId || null, project_id: t.projectId || null, note: t.note,
  }).eq("id", id).select().single();
  if (error) throw error;
  return rowToTx(data);
}
export async function deleteTransactionRow(id) {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}

// ---------- events (캘린더 일정) ----------
function rowToEvent(r) {
  return { id: r.id, date: r.date, title: r.title, note: r.note || "", createdAt: r.created_at };
}
export async function fetchEvents() {
  const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true });
  if (error) { console.error(error); return []; }
  return data.map(rowToEvent);
}
export async function insertEvent(e) {
  const { data, error } = await supabase.from("events").insert({
    date: e.date, title: e.title, note: e.note,
  }).select().single();
  if (error) throw error;
  return rowToEvent(data);
}
export async function updateEvent(id, e) {
  const { data, error } = await supabase.from("events").update({
    date: e.date, title: e.title, note: e.note,
  }).eq("id", id).select().single();
  if (error) throw error;
  return rowToEvent(data);
}
export async function deleteEventRow(id) {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}

// ---------- projects (프로젝트) ----------
function rowToProject(r) {
  return {
    id: r.id, name: r.name, note: r.note || "", items: r.items || [],
    status: r.status, appliedAt: r.applied_at, dueDate: r.due_date || null, createdAt: r.created_at,
  };
}
export async function fetchProjects() {
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return data.map(rowToProject);
}
export async function insertProject(p) {
  const { data, error } = await supabase.from("projects").insert({
    name: p.name, note: p.note, items: p.items, status: p.status || "pending", due_date: p.dueDate || null,
  }).select().single();
  if (error) throw error;
  return rowToProject(data);
}
export async function updateProject(id, p) {
  const patch = { name: p.name, note: p.note, items: p.items, status: p.status, due_date: p.dueDate || null };
  if (p.appliedAt !== undefined) patch.applied_at = p.appliedAt;
  const { data, error } = await supabase.from("projects").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return rowToProject(data);
}
export async function deleteProjectRow(id) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

// ---------- incoming_requests (입고예정) ----------
function rowToIncoming(r) {
  return {
    id: r.id, projectId: r.project_id || null, name: r.name, qty: Number(r.qty), unit: r.unit || null,
    status: r.status, destination: r.destination || null, location: r.location || null,
    itemId: r.item_id || null, receivedAt: r.received_at || null, createdAt: r.created_at,
  };
}
export async function fetchIncomingRequests() {
  const { data, error } = await supabase.from("incoming_requests").select("*").order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return data.map(rowToIncoming);
}
export async function insertIncomingRequest(r) {
  const { data, error } = await supabase.from("incoming_requests").insert({
    project_id: r.projectId || null, name: r.name, qty: r.qty, unit: r.unit || null, status: "pending",
  }).select().single();
  if (error) throw error;
  return rowToIncoming(data);
}
export async function updateIncomingRequest(id, patch) {
  const dbPatch = {};
  if ("status" in patch) dbPatch.status = patch.status;
  if ("destination" in patch) dbPatch.destination = patch.destination;
  if ("location" in patch) dbPatch.location = patch.location;
  if ("itemId" in patch) dbPatch.item_id = patch.itemId;
  if ("receivedAt" in patch) dbPatch.received_at = patch.receivedAt;
  const { data, error } = await supabase.from("incoming_requests").update(dbPatch).eq("id", id).select().single();
  if (error) throw error;
  return rowToIncoming(data);
}
export async function deleteIncomingRequestRow(id) {
  const { error } = await supabase.from("incoming_requests").delete().eq("id", id);
  if (error) throw error;
}

// ---------- pending_changes (변경 승인 대기) ----------
function rowToPending(r) {
  return {
    id: r.id, entity: r.entity, action: r.action, targetId: r.target_id,
    payload: r.payload, summary: r.summary, requestedBy: r.requested_by, createdAt: r.created_at,
  };
}
export async function fetchPending() {
  const { data, error } = await supabase.from("pending_changes").select("*").order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return data.map(rowToPending);
}
export async function insertPending(p) {
  const { data, error } = await supabase.from("pending_changes").insert({
    entity: p.entity, action: p.action, target_id: p.targetId,
    payload: p.payload, summary: p.summary, requested_by: p.requestedBy,
  }).select().single();
  if (error) throw error;
  return rowToPending(data);
}
export async function deletePendingRow(id) {
  const { error } = await supabase.from("pending_changes").delete().eq("id", id);
  if (error) throw error;
}

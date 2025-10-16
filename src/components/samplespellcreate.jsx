import React, { useEffect, useMemo, useRef, useState } from "react";
import { Container, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaCog } from "react-icons/fa";

import Logo from "./assets/LearnEngLG-rmb.png";
import Bg from "./assets/Category__Game_1_BG.png";
import UserIcon from "./assets/Admin_Icon.png";
import DiceIcon from "./assets/Dice_Icon.png";
import UploadIcon from "./assets/Upload_Icon.png";

import WL from "./FruitBasketWL.module.css";



/* ensure descriptions end with a period and start capitalized */
const oneSentence = (txt) =>
  !txt ? "" : (txt[0].toUpperCase() + txt.slice(1)).replace(/\s*\.*$/, ".");

/* ----- AI fetcher: calls your server.js -> /api/suggest-word ----- */
async function getAIWord() {
  const res = await fetch("/api/suggest-word", { method: "POST" });
  if (!res.ok) throw new Error("AI endpoint failed");
  // Expecting { word: "HARVEST", description: "A harvest is ..." }
  return res.json();
}

export default function FruitBasketWL() {
  const navigate = useNavigate();

  // full word records
  const [words, setWords] = useState([
    { id: "w1", text: "HELLO",  points: 0, difficulty: "easy", description: "", imageURL: null },
    { id: "w2", text: "BOTTLE", points: 0, difficulty: "easy", description: "", imageURL: null },
    { id: "w3", text: "CHAIR",  points: 0, difficulty: "easy", description: "", imageURL: null },
    { id: "w4", text: "APPLE",  points: 0, difficulty: "easy", description: "", imageURL: null },
  ]);
  const [assessmentNo] = useState("0001");

  // gear menu
  const [menuIdx, setMenuIdx] = useState(null);
  const menuRef = useRef(null);

  // unified modal (CREATE + EDIT)
  const [showEdit, setShowEdit] = useState(false);
  const [editIdx, setEditIdx] = useState(null); // null => creating
  const [form, setForm] = useState({
    text: "",
    description: "",
    points: 0,
    difficulty: "easy",
    imageURL: "",
    imageFile: null,
  });

  // dice loading
  const [diceLoading, setDiceLoading] = useState(false);

  // close menu on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuIdx(null);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // revoke blob on unmount/change
  useEffect(
    () => () => {
      if (form.imageURL && typeof form.imageURL === "string" && form.imageURL.startsWith("blob:")) {
        try { URL.revokeObjectURL(form.imageURL); } catch {}
      }
    },
    [form.imageURL]
  );

  /* ---------- list actions ---------- */
  const openMenu = (idx) => setMenuIdx(menuIdx === idx ? null : idx);

  const openEdit = (idx) => {
    const w = words[idx];
    setEditIdx(idx);
    setForm({
      text: w.text,
      description: w.description || "",
      points: Number(w.points) || 0,
      difficulty: w.difficulty || "easy",
      imageURL: w.imageURL || "",
      imageFile: null,
    });
    setShowEdit(true);
    setMenuIdx(null);
  };

  const openCreate = () => {
    setEditIdx(null);
    setForm({
      text: "",
      description: "",
      points: 0,
      difficulty: "easy",
      imageURL: "",
      imageFile: null,
    });
    setShowEdit(true);
  };

  const confirmDelete = (idx) => {
    const { text } = words[idx];
    if (window.confirm(`Delete "${text}" from this list? This cannot be undone.`)) {
      setWords((prev) => prev.filter((_, i) => i !== idx));
      setMenuIdx(null);
    }
  };

  /* ---------- modal helpers ---------- */
  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const charCount = useMemo(() => form.description.length, [form.description]);

  // AI-powered dice
  const handleRandom = async () => {
    try {
      setDiceLoading(true);
      const { word, description } = await getAIWord();
      const up = String(word || "").toUpperCase().slice(0, 30);
      const desc = oneSentence(String(description || "").slice(0, 180));
      setField("text", up);
      if (!form.description.trim()) setField("description", desc);
    } catch (e) {
      alert("Sorry, AI couldn’t fetch a word right now. Please try again.");
    } finally {
      setDiceLoading(false);
    }
  };

  const decPoints = () => setField("points", Math.max(0, (Number(form.points) || 0) - 1));
  const incPoints = () => setField("points", Math.min(99, (Number(form.points) || 0) + 1));

  const onChooseFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setField("imageFile", f);
    setField("imageURL", url);
  };

  const onSave = () => {
    const cleanedText = form.text.trim().toUpperCase();
    if (!cleanedText) return alert("Please enter a word first.");

    // duplicate check (ignore current when editing)
    const duplicate = words.some(
      (w, i) => i !== editIdx && w.text.toLowerCase() === cleanedText.toLowerCase()
    );
    if (duplicate) return alert("That word already exists.");

    const normalizedDesc = oneSentence(form.description.trim());

    if (editIdx === null) {
      // CREATE
      setWords((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: cleanedText,
          description: normalizedDesc,
          difficulty: form.difficulty,
          points: Number(form.points) || 0,
          imageURL: form.imageURL || null,
        },
      ]);
    } else {
      // EDIT
      setWords((prev) => {
        const copy = [...prev];
        copy[editIdx] = {
          ...copy[editIdx],
          text: cleanedText,
          description: normalizedDesc,
          difficulty: form.difficulty,
          points: Number(form.points) || 0,
          imageURL: form.imageURL || null,
        };
        return copy;
      });
    }

    // NOTE: form.imageFile is local; upload it when you add storage later
    setShowEdit(false);
  };

  return (
    <div className={WL.fbBg} style={{ backgroundImage: `url(${Bg})` }}>
      {/* Header */}
      <div className={WL.fbHeader}>
        <img src={Logo} alt="LearnENG" className={WL.fbLogo} />
        <div className="d-flex align-items-center gap-2 text-white">
          <span className="fw-semibold">Welcome, Teacher!</span>
          <img src={UserIcon} alt="User" className={WL.fbUser} />
        </div>
      </div>

      {/* Back */}
      <div className={WL.fbBackWrap}>
        <button className={WL.fbBack} onClick={() => navigate(-1)}>Back</button>
      </div>

      {/* Main */}
      <Container className={WL.fbOuter}>
        <h3 className={WL.fbTitle}>
          Assessment No. {assessmentNo} – <span>Word List</span>
        </h3>

        <div className={WL.fbInner}>
          <div className={WL.fbListScroll} ref={menuRef}>
            {words.map((w, idx) => (
              <div key={w.id} className={WL.fbRow}>
                <button className={WL.fbRowMain} onClick={() => openEdit(idx)}>
                  <span className={WL.fbRowName}>{w.text}</span>
                </button>

                <button
                  className={WL.fbGearBtn}
                  aria-expanded={menuIdx === idx}
                  title="Options"
                  onClick={() => openMenu(idx)}
                >
                  <FaCog />
                </button>

                {menuIdx === idx && (
                  <div className={WL.fbMenu}>
                    <button onClick={() => openEdit(idx)}>Edit</button>
                    <button className={WL.danger} onClick={() => confirmDelete(idx)}>Delete</button>
                  </div>
                )}
              </div>
            ))}

            {words.length === 0 && (
              <div className="text-center text-muted py-4">No words yet — add one below.</div>
            )}
          </div>
        </div>

        <Button className={WL.fbCreate} onClick={openCreate}>
          <FaPlus className="me-2" />
          Create New
        </Button>
      </Container>

      {/* Unified CREATE/EDIT modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered dialogClassName={WL.bigModal}>
        <div className={WL.editCard}>
          <div className={WL.editHead}>
            <button className={WL.closeRound} onClick={() => setShowEdit(false)} aria-label="Close">×</button>
            <h4>Fruit Basket – Assessment No. {assessmentNo}</h4>
          </div>

          <div className={WL.editGrid}>
            {/* LEFT */}
            <div>
              {/* Word + Dice */}
              <div className={WL.formRow}>
                <label className={WL.label} htmlFor="fbWord">Input Word:</label>
                <div className={WL.wordWrap}>
                  <input
                    id="fbWord"
                    className={WL.wordInput}
                    value={form.text}
                    onChange={(e) => setField("text", e.target.value.toUpperCase().slice(0, 30))}
                    placeholder="Enter word…"
                  />
                  <button
                    className={WL.diceBtn}
                    type="button"
                    onClick={handleRandom}
                    title="AI random word"
                    disabled={diceLoading}
                  >
                    {diceLoading ? "…" : <img src={DiceIcon} alt="" />}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className={WL.formRow}>
                <label className={WL.label} htmlFor="fbDesc" aria-hidden />
                <div className={WL.descWrap}>
                  <textarea
                    id="fbDesc"
                    className={WL.desc}
                    rows={5}
                    value={form.description}
                    placeholder="Write a short, 1-sentence explanation (end with a period)."
                    onChange={(e) => setField("description", e.target.value.slice(0, 180))}
                  />
                  <div className={WL.counter}>{charCount}/180</div>
                </div>
              </div>

              {/* Upload */}
              <div className={WL.formRow}>
                <label className={WL.label} aria-hidden />
                <div className={WL.actionsRow}>
                  <label className={WL.uploadBtn}>
                    <span className={WL.upIconWrap}><img src={UploadIcon} alt="" /></span>
                    Upload Image
                    <input type="file" accept="image/*" onChange={onChooseFile} style={{ display: "none" }} />
                  </label>
                  {form.imageURL && (
                    <a className={WL.viewInline} href={form.imageURL} target="_blank" rel="noreferrer">
                      View Image
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className={WL.rightCol}>
              <div className={WL.pointsBlock}>
                <span className={WL.pointsLabel}>Set Points:</span>
                <div className={WL.stepper}>
                  <button className={WL.stepBtn} type="button" onClick={decPoints}>–</button>
                  <input className={WL.stepValue} value={form.points} readOnly />
                  <button className={WL.stepBtn} type="button" onClick={incPoints}>+</button>
                </div>
              </div>

              <div className={WL.diffBlock}>
                <span className={WL.diffTitle}>Select Difficulty:</span>
                <label className={WL.radio}>
                  <input
                    type="radio"
                    name="diff"
                    checked={form.difficulty === "easy"}
                    onChange={() => setField("difficulty", "easy")}
                  />
                  <span>Easy</span>
                </label>
                <label className={WL.radio}>
                  <input
                    type="radio"
                    name="diff"
                    checked={form.difficulty === "medium"}
                    onChange={() => setField("difficulty", "medium")}
                  />
                  <span>Medium</span>
                </label>
                <label className={WL.radio}>
                  <input
                    type="radio"
                    name="diff"
                    checked={form.difficulty === "hard"}
                    onChange={() => setField("difficulty", "hard")}
                  />
                  <span>Hard</span>
                </label>
              </div>
            </div>
          </div>

          <div className={WL.footerRow}>
            <button type="button" className={WL.secondaryBtn} onClick={() => setShowEdit(false)}>
              Cancel
            </button>
            <button type="button" className={WL.saveBtn} onClick={onSave}>
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
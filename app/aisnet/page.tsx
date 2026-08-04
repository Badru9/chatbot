"use client";

import {
  Table,
  Button,
  Link,
  Avatar,
  type TableColumnProps,
} from "@heroui/react";

const ASSET_BASE =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";
const asset = (hash: string, ext = "svg") =>
  `${ASSET_BASE}${hash}.${ext}?generation=1785324503607392&amp;alt=media`;

const LOGO_URL = asset("47bbb8c821dbe48f4a4c84873c993f419850698a", "png");
const TOGGLE_ICON = asset("b13beb6bc8e1ebe30da3dab22c0969c142791c9d");
const BELL_ICON = asset("8e627c5ce40f938fc56f88ac0e20e7c76c265048");
const USER_AVATAR = "https://api-aisnet.itg.ac.id/uploads/foto/F1669432653.png";

// ─── Sidebar data ─────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: string;
  active?: boolean;
  /** Inline SVG chevron for expandable items (Survei Kepuasan) */
  hasChevron?: boolean;
}

interface NavSection {
  heading?: string;
  items: NavItem[];
}

const SIDEBAR_SECTIONS: NavSection[] = [
  {
    items: [
      {
        label: "Dasbor",
        href: "https://aisnet.itg.ac.id/",
        icon: asset("a99f684585cd54033cee7f5527cf5684b7bf9b8c"),
      },
    ],
  },
  {
    heading: "Perkuliahan",
    items: [
      {
        label: "Perwalian",
        href: "https://aisnet.itg.ac.id/perwalian",
        icon: asset("f2877fc478a5920005b50b496666f94e42274239"),
      },
      {
        label: "Kontrak Perkuliahan",
        href: "https://aisnet.itg.ac.id/kontrak-perkuliahan-new",
        icon: asset("100023486d5ae23f1589fa0e506dc91b3c1f4be4"),
      },
      {
        label: "Pembelajaran Daring",
        href: "https://aisnet.itg.ac.id/laporan-pembelajaran/dosen/mata-kuliah",
        icon: asset("d18cf3723e79d79e2667a70ff76d5d440577501d"),
      },
      {
        label: "Rekap Absen",
        href: "https://aisnet.itg.ac.id/rekap-absen",
        icon: asset("10ecf8fb7f50ae45f3c5b6bfad844655f196e413"),
      },
      {
        label: "Survei Kepuasan",
        href: "#",
        icon: asset("003f6443a6408d0a6fc2b654d76ad6e2742f3260"),
        hasChevron: true,
      },
    ],
  },
  {
    heading: "Penilaian Hasil Belajar",
    items: [
      {
        label: "UTS",
        href: "https://aisnet.itg.ac.id/phb/uts/jadwal",
        icon: asset("e0d54ea1dd1c563c2882de975a3c48534b471b25"),
      },
      {
        label: "UTS Susulan",
        href: "https://aisnet.itg.ac.id/phb/uts-susulan/jadwal",
        icon: asset("71a779ac49780835823e1edfacdf2931e8e4fa73"),
      },
      {
        label: "UAS",
        href: "https://aisnet.itg.ac.id/phb/uas/jadwal",
        icon: asset("e452571b55c25c20f3cb48c0e1cdf2a02b366c97"),
      },
      {
        label: "UAS Susulan",
        href: "https://aisnet.itg.ac.id/phb/uas-susulan/jadwal",
        icon: asset("18c1a0d1204bfb043d7f5bce0ac472436d701035"),
      },
    ],
  },
  {
    heading: "Penelitian dan PKM",
    items: [
      {
        label: "Pengusulan",
        href: "https://aisnet.itg.ac.id/penelitian-usul",
        icon: asset("b8939dec27cd21aa8f8f6b5b901ef71670a40295"),
      },
      {
        label: "Undangan PPM",
        href: "https://aisnet.itg.ac.id/undangan-penelitian",
        icon: asset("a971a70b452ad846f14fcbbb4d60359e7699f733"),
      },
      {
        label: "Luaran Tambahan",
        href: "https://aisnet.itg.ac.id/penelitian-luaran-tambahan",
        icon: asset("76ce55307a5b130ff044c242840872cd6a48c061"),
      },
      {
        label: "Kewajiban Tahunan",
        href: "https://aisnet.itg.ac.id/insentif-bulanan",
        icon: asset("82ac15c2f52741dba63ebdee2f532870d3e047e4"),
      },
    ],
  },
  {
    heading: "Hak Kekayaan Intelektual",
    items: [
      {
        label: "Hak Cipta",
        href: "https://aisnet.itg.ac.id/hki/hakCipta",
        icon: asset("d604f609d74f581af6eb4ff95e45d1ce17e1bcdb"),
      },
    ],
  },
  {
    heading: "Keuangan",
    items: [
      {
        label: "Gaji Pegawai",
        href: "https://aisnet.itg.ac.id/gaji",
        icon: asset("7af9c0c05571b2b5388b1c8dcd53b1184167e260"),
      },
      {
        label: "Penelitian dan PkM",
        href: "https://aisnet.itg.ac.id/pencairan-pkm",
        icon: asset("965edbb19b4854dfa4ea286a0c81eb6f48448f3b"),
        active: true,
      },
      {
        label: "Honorarium UTS",
        href: "https://aisnet.itg.ac.id/honor-uts",
        icon: asset("bdccfef52bb7e50f61f1745ab294b94090e33ae5"),
      },
      {
        label: "Honorarium UAS",
        href: "https://aisnet.itg.ac.id/honor-uas",
        icon: asset("6869c02c7d35e6ea2461dd28a631830fb13b728d"),
      },
      {
        label: "Honorarium Kerja Praktik",
        href: "https://aisnet.itg.ac.id/honor-kp",
        icon: asset("20ea13ceafd24bd2b2b6a1eddbf2fe3494b87b23"),
      },
      {
        label: "Honorarium SUP Skripsi",
        href: "https://aisnet.itg.ac.id/honor-ta-sup",
        icon: asset("2cff56b64573a35341d0c15012964f8ee1282d6a"),
      },
      {
        label: "Honorarium Sidang Skripsi",
        href: "https://aisnet.itg.ac.id/honor-ta-sidang",
        icon: asset("576b1f6f6c9b7e127a92ddabc8dd260b95d60acf"),
      },
    ],
  },
  {
    heading: "",
    items: [
      {
        label: "",
        href: "https://aisnet.itg.ac.id/pengumuman",
        icon: asset("c8ecb5f9c96f3ccb1d0328a9449d488e06052753"),
      },
    ],
  },
];

interface TableRowData {
  no: number;
  jenis: string;
  judul: string;
  jenisPencairan: string;
  nominal: string;
  tanggal: string;
}

const COLUMNS: TableColumnProps[] = [
  {
    key: 1,
    width: 50,
    textValue: "No",
  },
  {
    key: 2,
    width: 50,
    textValue: "Jenis",
  },
  {
    key: 3,
    width: 50,
    textValue: "Judul",
  },
  {
    key: 4,
    width: 50,
    textValue: "Jenis Pencairan",
  },
  {
    key: 5,
    width: 50,
    textValue: "Nominal",
  },
  {
    key: 6,
    width: 50,
    textValue: "Tanggal",
  },
  {
    key: 7,
    width: 50,
    textValue: "Aksi",
  },
];

const TABLE_DATA: TableRowData[] = [
  {
    no: 1,
    jenis: "PENELITIAN",
    judul:
      "Generative Intelligence Chatbot Untuk Perguruan Tinggi Berbasis Model Transformer",
    jenisPencairan: "Dana Awal",
    nominal: "Rp\u00a02.500.000",
    tanggal: "2026-07-04 10:06:00",
  },
  {
    no: 2,
    jenis: "PENELITIAN",
    judul:
      "A Bilingual Academic Chatbot Based on Semantic Retrieval Using m-BERT",
    jenisPencairan: "Dana Awal",
    nominal: "Rp\u00a02.500.000",
    tanggal: "2026-06-22 16:04:00",
  },
  {
    no: 3,
    jenis: "PENELITIAN",
    judul:
      "Plant Disease Detection Using Digital Image Processing : Opportunities and challenges",
    jenisPencairan: "Dana Awal",
    nominal: "Rp\u00a02.500.000",
    tanggal: "2026-01-30 10:56:00",
  },
  {
    no: 4,
    jenis: "PENELITIAN",
    judul:
      "Plant Disease Detection Using Digital Image Processing : Opportunities and challenges",
    jenisPencairan: "Sisa Dana",
    nominal: "Rp\u00a02.500.000",
    tanggal: "2026-01-30 10:56:00",
  },
  {
    no: 5,
    jenis: "PENELITIAN",
    judul: "Object Detection on Analog Water Meters Using Region-Based CNN",
    jenisPencairan: "Dana Awal",
    nominal: "Rp\u00a01.750.000",
    tanggal: "2026-01-30 10:48:00",
  },
  {
    no: 6,
    jenis: "PENELITIAN",
    judul: "Object Detection on Analog Water Meters Using Region-Based CNN",
    jenisPencairan: "Sisa Dana",
    nominal: "Rp\u00a01.750.000",
    tanggal: "2026-01-30 10:39:00",
  },
];

// ─── Shared style constants ───────────────────────────────────
const CHEVRON_SVG = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 9' fill='%239899ac'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M5.93537 4.57889C6.03839 4.77912 6.0191 5.0363 5.87137 5.21403L2.87153 8.82282C2.68598 9.04603 2.36951 9.06026 2.16468 8.8546C1.95985 8.64893 1.94422 8.30126 2.12977 8.07804L4.80594 4.85863L2.15586 1.93583C1.96104 1.72096 1.96165 1.37314 2.15722 1.15895C2.35279 0.944757 2.66927 0.945311 2.86409 1.16018L5.85194 4.45551C5.8859 4.49296 5.91371 4.53459 5.93537 4.57889Z'/%3e%3c/svg%3e")`;

const ROW_BORDER_COLOR = "rgb(239, 242, 245)";

// ─── Sub-components ───────────────────────────────────────────

/** Single sidebar nav icon wrapper */
function NavIcon({ src }: { src: string }) {
  return (
    <span className="items-center flex justify-start w-[26px] mr-[6.5px] text-[rgb(73,75,116)] shrink-[0]">
      <span className="block leading-[13px]">
        <div className="inline fill-none overflow-hidden align-middle w-[19.5px] h-[19.5px]">
          <img src={src} className="inline w-[19.5px] h-[19.5px]" alt="" />
        </div>
      </span>
    </span>
  );
}

/** Active-state nav icon (blue tint) */
function NavIconActive({ src }: { src: string }) {
  return (
    <span className="items-center flex justify-start w-[26px] mr-[6.5px] text-[rgb(0,158,247)] shrink-[0]">
      <span className="block leading-[13px]">
        <div className="inline fill-none overflow-hidden align-middle w-[19.5px] h-[19.5px]">
          <img src={src} className="inline w-[19.5px] h-[19.5px]" alt="" />
        </div>
      </span>
    </span>
  );
}

/** Sidebar section heading */
function SectionHeading({ text }: { text: string }) {
  return (
    <div className="pt-[26px] pr-[25px] pb-[6.5px] pl-[25px]">
      <span className="uppercase text-[rgb(223,230,233)] text-[11.05px] tracking-[1.3px] leading-[16.575px]">
        {text}
      </span>
    </div>
  );
}

/** Sidebar navigation link */
function SidebarLink({ item }: { item: NavItem }) {
  if (item.active) {
    return (
      <Link
        href={item.href}
        className="items-center flex bg-[rgb(27,27,40)] text-white pt-[9.75px] pr-[25px] pb-[9.75px] pl-[25px] no-underline"
      >
        <NavIconActive src={item.icon} />
        <span className="items-center flex grow">{item.label}</span>
      </Link>
    );
  }

  if (item.hasChevron) {
    return (
      <span className="items-center flex text-[rgb(152,153,172)] pt-[9.75px] pr-[25px] pb-[9.75px] pl-[25px]">
        <NavIcon src={item.icon} />
        <span className="items-center flex grow">{item.label}</span>
        <span className="items-stretch flex overflow-hidden relative w-[10.4px] h-[10.4px] ml-[6.5px] shrink-[0]">
          <div
            className="bg-center bg-no-repeat w-full content-['']"
            style={{ backgroundImage: CHEVRON_SVG }}
          />
        </span>
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className="items-center flex text-[rgb(152,153,172)] pt-[9.75px] pr-[25px] pb-[9.75px] pl-[25px] no-underline"
    >
      <NavIcon src={item.icon} />
      <span className="items-center flex grow">{item.label}</span>
    </Link>
  );
}

// ─── Table cell styles ────────────────────────────────────────
const CELL_BASE =
  "shadow-[rgba(0,0,0,0)_0px_0px_0px_9999px_inset] pt-[13px] pr-[9.75px] pb-[13px]";
const BORDERED_CELL = `border-b align-top ${CELL_BASE}`;
const LAST_ROW_CELL = `align-top ${CELL_BASE}`;

export default function AisnetPage() {
  return (
    <div
      className="min-h-screen text-black text-[13px] leading-[normal]"
      style={{
        fontFamily: "Poppins, Helvetica, sans-serif",
        textDecoration: "none",
        width: "2560px",
        transform: "scale(1)",
        margin: "auto",
      }}
    >
      <div className="flex flex-col h-full bg-[rgb(245,248,250)] text-[rgb(24,28,50)] leading-[19.5px]">
        <div className="flex flex-col">
          <div className="flex grow shrink-[0]">
            {/* ── Sidebar ── */}
            <aside className="flex flex-col overflow-hidden fixed w-[265px] left-0 top-0 bottom-0 bg-[rgb(30,30,45)] shadow-[rgba(82,63,105,0.05)_0px_0px_28px_0px] z-[101]">
              {/* Sidebar header */}
              <div className="items-center flex justify-between h-[65px] bg-[rgb(26,26,39)] pt-0 pr-[25px] pb-0 pl-[25px] shrink-[0]">
                <Link
                  href="https://aisnet.itg.ac.id/"
                  className="block text-[rgb(0,158,247)] no-underline"
                >
                  <img
                    alt="Logo"
                    src={LOGO_URL}
                    className="overflow-clip align-middle h-[25px]"
                  />
                </Link>
                <Button
                  variant="ghost"
                  className="items-center flex font-medium justify-center text-center align-middle h-[42.95px] text-[rgb(73,75,116)] text-[14.3px] leading-[21.45px] rounded-[0.3859375rem] min-w-0 p-0 bg-transparent"
                >
                  <span className="block text-center text-[rgb(161,165,183)] leading-[14.3px] shrink-[0]">
                    <div className="inline fill-none overflow-hidden text-center align-middle w-[22.75px] h-[22.75px]">
                      <img
                        src={TOGGLE_ICON}
                        className="inline w-[22.75px] h-[22.75px]"
                        alt=""
                      />
                    </div>
                  </span>
                </Button>
              </div>

              {/* Sidebar navigation */}
              <nav className="grow w-[265px] shrink-[0]">
                <div className="overflow-x-auto overflow-y-hidden relative h-[1099px] mt-[16.25px] mb-[16.25px]">
                  <div className="flex flex-col w-full">
                    {SIDEBAR_SECTIONS.map((section, sIdx) => (
                      <div key={sIdx}>
                        {section.heading !== undefined && (
                          <SectionHeading text={section.heading} />
                        )}
                        {section.items.map((item, iIdx) => (
                          <div key={iIdx}>
                            <SidebarLink item={item} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </nav>

              {/* Sidebar footer button */}
              <div className="pt-[16.25px] pr-[16.25px] pb-[22.75px] pl-[16.25px] shrink-[0]">
                <Link
                  href="https://drive.google.com/drive/folders/1rn2StvyZ1jv9HuUvcFWVwgM4bB1-gXZW"
                  className="items-center flex font-medium justify-center text-center align-middle w-full bg-[rgba(63,66,84,0.35)]/35 text-[rgb(181,181,195)] text-[14.3px] leading-[21.45px] pt-[10.75px] pr-[20.5px] pb-[10.75px] pl-[20.5px] rounded-[0.3859375rem] no-underline"
                >
                  <span className="block overflow-hidden text-center whitespace-nowrap" />
                </Link>
              </div>
            </aside>

            {/* ── Main content area ── */}
            <div className="flex flex-col grow pt-[65px] pr-0 pb-0 pl-[265px]">
              {/* Top header bar */}
              <header className="items-stretch flex justify-between fixed h-[65px] left-[265px] top-0 right-0 bg-white shadow-[rgba(82,63,105,0.05)_0px_10px_30px_0px] z-[100]">
                <div className="items-stretch flex justify-between ml-auto mr-auto w-full pt-0 pr-[30px] pb-0 pl-[30px]">
                  <div className="items-center flex" />
                  <div className="items-stretch flex grow justify-between">
                    {/* Page title + breadcrumb */}
                    <div className="items-center flex">
                      <div className="items-center flex flex-wrap mr-[9.75px]">
                        <h1 className="items-center flex font-semibold mt-[3.25px] mb-[3.25px] text-[17.55px] leading-[21.06px]">
                          Keuangan
                        </h1>
                        <span className="border-l block h-5 ml-[13px] mr-[13px] border-[rgb(161,165,183)]" />
                        <span className="block text-[rgb(94,98,120)]">
                          Penelitian dan PkM
                        </span>
                      </div>
                    </div>

                    {/* User controls */}
                    <div className="items-stretch flex shrink-[0]">
                      <div className="items-center flex ml-[-6.5px] mr-[6.5px]">
                        <Button
                          variant="ghost"
                          className="items-center flex font-medium justify-center relative text-center align-middle w-10 h-10 text-[14.3px] leading-[21.45px] rounded-[0.3859375rem] min-w-0 p-0 bg-transparent"
                        >
                          <span className="block text-center text-[rgb(161,165,183)] leading-[14.3px] shrink-[0]">
                            <div className="inline fill-none overflow-hidden text-center align-middle w-[22.75px] h-[22.75px]">
                              <img
                                src={BELL_ICON}
                                className="inline w-[22.75px] h-[22.75px]"
                                alt=""
                              />
                            </div>
                          </span>
                        </Button>
                      </div>
                      <div className="items-center flex ml-[9.75px]">
                        <div className="flex relative items-center shrink-[0] rounded-[0.3859375rem]">
                          <Avatar className="w-10 h-10 rounded-[0.3859375rem]">
                            <Avatar.Image alt="user" src={USER_AVATAR} />
                            <Avatar.Fallback className="rounded-[0.3859375rem]">
                              LF
                            </Avatar.Fallback>
                          </Avatar>
                          <div className="ml-[16.25px]">
                            <span className="items-center flex font-semibold capitalize text-[14.95px] leading-[22.425px]">
                              leni fitriani
                            </span>
                            <span className="font-medium capitalize text-[rgb(161,165,183)] text-[12.35px] leading-[18.525px]">
                              dosen
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* ── Main content ── */}
              <main className="flex mx-auto p-10">
                <Table>
                  <Table.ScrollContainer>
                    <Table.Content
                      aria-label="Tabel Penelitian dan PkM"

                      //   classNames={{
                      //     table:
                      //       "table align-top w-full mb-[13px] border-collapse",
                      //     thead: "table-header-group align-bottom",
                      //     tr: "border-b table-row align-top",
                      //     th: "bg-[rgb(245,248,250)] font-semibold border-b text-left align-bottom border-[rgb(239,242,245)] pt-[13px] pb-[13px]",
                      //     td: "align-top",
                      //   }}
                    >
                      <Table.Header columns={COLUMNS}>
                        {(column) => (
                          <Table.Column
                            key={column.key}
                            isRowHeader
                            className="pl-[9.75px] pr-[9.75px]"
                          >
                            {column.textValue}
                          </Table.Column>
                        )}
                      </Table.Header>
                      <Table.Body>
                        {TABLE_DATA.map((row, idx) => {
                          const isLast = idx === TABLE_DATA.length - 1;
                          const cell = isLast ? LAST_ROW_CELL : BORDERED_CELL;
                          const borderStyle = isLast
                            ? undefined
                            : { borderBottomColor: ROW_BORDER_COLOR };

                          return (
                            <Table.Row
                              key={row.no}
                              className="table-row align-top"
                              style={borderStyle}
                            >
                              <Table.Cell
                                className={`${cell} text-right pl-0`}
                                style={borderStyle}
                              >
                                {row.no}
                              </Table.Cell>
                              <Table.Cell
                                className={`${cell} w-[100px] pl-[9.75px]`}
                                style={borderStyle}
                              >
                                {row.jenis}
                              </Table.Cell>
                              <Table.Cell
                                className={`${cell} pl-[9.75px]`}
                                style={borderStyle}
                              >
                                {row.judul}
                              </Table.Cell>
                              <Table.Cell
                                className={`${cell} pl-[9.75px]`}
                                style={borderStyle}
                              >
                                {row.jenisPencairan}
                              </Table.Cell>
                              <Table.Cell
                                className={`${cell} text-right pl-[9.75px]`}
                                style={borderStyle}
                              >
                                {row.nominal}
                              </Table.Cell>
                              <Table.Cell
                                className={`${cell} pl-[9.75px]`}
                                style={borderStyle}
                              >
                                {row.tanggal}
                              </Table.Cell>
                              <Table.Cell
                                className={`${isLast ? LAST_ROW_CELL : BORDERED_CELL} pr-0 pl-[9.75px]`}
                                style={borderStyle}
                              >
                                <Button
                                  variant="tertiary"
                                  className={"rounded-md"}
                                  onClick={() =>
                                    console.log(
                                      `check data n idx ${JSON.stringify(row)}, ${idx}`,
                                    )
                                  }
                                >
                                  Detail
                                </Button>
                              </Table.Cell>
                            </Table.Row>
                          );
                        })}
                      </Table.Body>
                    </Table.Content>
                  </Table.ScrollContainer>
                </Table>
              </main>

              {/* ── Footer ── */}
              <footer className="flex flex-col mb-[13px] pt-[13px] pr-0 pb-[13px] pl-0">
                <div className="items-center flex justify-between ml-auto mr-auto w-full pt-0 pr-[30px] pb-0 pl-[30px]">
                  <div>
                    <span className="text-[rgb(161,165,183)]">
                      © 2022 AISnet Web Institut Teknologi Garut (ITG)
                    </span>
                  </div>
                  <div>
                    <span className="text-[rgb(161,165,183)]">
                      Lembaga Sistem Informasi dan Pangkalan Data (LSIPD)
                    </span>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

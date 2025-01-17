{
  formattedDate ===
  `${yearPagination}-${doubleDigitFormatting(monthPagination)}-${i}` ? (
    <div className="today">TODAY</div>
  ) : (
    <div></div>
  );
}

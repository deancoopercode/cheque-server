o summarize, using "And" adds the word "and" in front of the tens/units text; using "Check" formats any decimal values as would be written on a check; and using "Dollar" adds the words "Dollars" and "Cents" in their appropriate positions. The code is laid out in a reasonably straight forward manner, so if Dollars/Cents is not you native currency designation, you should be able to modify the program accordingly. In addition to the above, for all modes, the Plus and Minus sign can be used and will be reported back as a word; commas may be used to separate the numbers to the left of the decimal point but they will not be reported back by the routine and are permitted for the users convenience (however, if commas are used, they must be placed in their correct positions). And, finally,if I remember correctly, this function will work with a whole number part up to one less than a quintillion (you can have as many decimal places as desired), but remember to format large numbers as Text values... otherwise VB will convert large non-Text values to Doubles (which will destroy the conversion).
Private sNumberText() As String
Public Function NumberAsText(NumberIn As Variant, Optional _
                AND_or_CHECK_or_DOLLAR_or_CHECKDOLLAR As String) As String
   Dim cnt As Long
   Dim DecimalPoint As Long
   Dim CardinalNumber As Long
   Dim CommaAdjuster As Long
   Dim TestValue As Long
   Dim CurrValue As Currency
   Dim CentsString As String
   Dim NumberSign As String
   Dim WholePart As String
   Dim BigWholePart As String
   Dim DecimalPart As String
   Dim tmp As String
   Dim sStyle As String
   Dim bUseAnd As Boolean
   Dim bUseCheck As Boolean
   Dim bUseDollars As Boolean
   Dim bUseCheckDollar As Boolean
  '----------------------------------------
  '  Begin setting conditions for formatting
  '----------------------------------------
  '  Determine whether to apply special formatting.
  '  If nothing passed, return routine result
  '  converted only into its numeric equivalents,
  '  with no additional format text.
   sStyle = LCase(AND_or_CHECK_or_DOLLAR_or_CHECKDOLLAR)
  '  User passed "AND": "and" will be added
  '  between hundredths and tens of dollars,
  '  ie "Three Hundred and Forty Two"
   bUseAnd = sStyle = "and"
  '  User passed "DOLLAR": "dollar(s)" and "cents"
  '  appended to string,
  '  ie "Three Hundred and Forty Two Dollars"
   bUseDollars = sStyle = "dollar"
  '  User passed "CHECK" *or* "DOLLAR"
  '  If "check", cent amount returned as a fraction /100
  '  i.e. "Three Hundred Forty Two and 00/100"
  '  If "dollar" was passed, "dollar(s)" and "cents"
  '  Appended instead.
   bUseCheck = (sStyle = "check") Or (sStyle = "dollar")
   bUseCheckDollar = sStyle = "checkdollar"
  '----------------------------------------
  '  Check/create array. If this is the first
  '  time using this routine, create the text
  '  strings that will be used.
  '----------------------------------------
   If Not IsBounded(sNumberText) Then
      Call BuildArray(sNumberText)
   End If
  '----------------------------------------
  '  Begin validating the number, and breaking
  '  into constituent parts
  '----------------------------------------
  '  Prepare to check for valid value in
   NumberIn = Trim$(NumberIn)
   If Not IsNumeric(NumberIn) Then
     '  Invalid entry - abort
      NumberAsText = "Error - Number improperly formed"
      Exit Function
   Else
     '  Decimal check
      DecimalPoint = InStr(NumberIn, ".")
      If DecimalPoint > 0 Then
        '  Split the fractional and primary numbers
         DecimalPart = Mid$(NumberIn, DecimalPoint + 1)
         WholePart = Left$(NumberIn, DecimalPoint - 1)
      Else
        '  Assume the decimal is the last char
         DecimalPoint = Len(NumberIn) + 1
         WholePart = NumberIn
      End If
      If InStr(NumberIn, ",,") Or _
         InStr(NumberIn, ",.") Or _
         InStr(NumberIn, ".,") Or _
         InStr(DecimalPart, ",") Then
         NumberAsText = "Error - Improper use of commas"
         Exit Function
      ElseIf InStr(NumberIn, ",") Then
         CommaAdjuster = 0
         WholePart = ""
         For cnt = DecimalPoint - 1 To 1 Step -1
            If Not Mid$(NumberIn, cnt, 1) Like "[,]" Then
               WholePart = Mid$(NumberIn, cnt, 1) & WholePart
            Else
               CommaAdjuster = CommaAdjuster + 1
               If (DecimalPoint - cnt - CommaAdjuster) Mod 3 Then
                  NumberAsText = "Error - Improper use of commas"
                  Exit Function
               End If
            End If
         Next
      End If
   End If
   If Left$(WholePart, 1) Like "[+-]" Then
      NumberSign = IIf(Left$(WholePart, 1) = "-", "Minus ", "Plus ")
      WholePart = Mid$(WholePart, 2)
   End If
  '----------------------------------------
  '  Begin code to assure decimal portion of
  '  check value is not inadvertently rounded
  '----------------------------------------
   If bUseCheck = True Then
      CurrValue = CCur(Val("." & DecimalPart))
      DecimalPart = Mid$(Format$(CurrValue, "0.00"), 3, 2)
      If CurrValue >= 0.995 Then
         If WholePart = String$(Len(WholePart), "9") Then
            WholePart = "1" & String$(Len(WholePart), "0")
         Else
            For cnt = Len(WholePart) To 1 Step -1
              If Mid$(WholePart, cnt, 1) = "9" Then
                 Mid$(WholePart, cnt, 1) = "0"
              Else
                 Mid$(WholePart, cnt, 1) = _
                            CStr(Val(Mid$(WholePart, cnt, 1)) + 1)
                 Exit For
              End If
            Next
         End If
      End If
   End If
  '----------------------------------------
  '  Final prep step - this assures number
  '  within range of formatting code below
  '----------------------------------------
   If Len(WholePart) > 9 Then
      BigWholePart = Left$(WholePart, Len(WholePart) - 9)
      WholePart = Right$(WholePart, 9)
   End If
   If Len(BigWholePart) > 9 Then
      NumberAsText = "Error - Number too large"
      Exit Function
   ElseIf Not WholePart Like String$(Len(WholePart), "#") Or _
         (Not BigWholePart Like String$(Len(BigWholePart), "#") _
          And Len(BigWholePart) > 0) Then
      NumberAsText = "Error - Number improperly formed"
      Exit Function
   End If
  '----------------------------------------
  '  Begin creating the output string
  '----------------------------------------
  '  Very Large values
   TestValue = Val(BigWholePart)
   If TestValue > 999999 Then
      CardinalNumber = TestValue \ 1000000
      tmp = HundredsTensUnits(CardinalNumber) & "Quadrillion "
      TestValue = TestValue - (CardinalNumber * 1000000)
   End If
   If TestValue > 999 Then
     CardinalNumber = TestValue \ 1000
     tmp = tmp & HundredsTensUnits(CardinalNumber) & "Trillion "
     TestValue = TestValue - (CardinalNumber * 1000)
   End If
   If TestValue > 0 Then
      tmp = tmp & HundredsTensUnits(TestValue) & "Billion "
   End If
  '  Lesser values
   TestValue = Val(WholePart)
   If TestValue = 0 And BigWholePart = "" Then tmp = "Zero "
   If TestValue > 999999 Then
      CardinalNumber = TestValue \ 1000000
      tmp = tmp & HundredsTensUnits(CardinalNumber) & "Million "
      TestValue = TestValue - (CardinalNumber * 1000000)
   End If
   If TestValue > 999 Then
      CardinalNumber = TestValue \ 1000
      tmp = tmp & HundredsTensUnits(CardinalNumber) & "Thousand "
      TestValue = TestValue - (CardinalNumber * 1000)
   End If
   If TestValue > 0 Then
      If Val(WholePart) < 99 And BigWholePart = "" Then bUseAnd = False
      tmp = tmp & HundredsTensUnits(TestValue, bUseAnd)
   End If
  '  If in dollar mode, assure the text is the correct plurality
   If bUseDollars = True Then
      CentsString = HundredsTensUnits(DecimalPart)
      If tmp = "One " Then
         tmp = tmp & "Dollar"
      Else
         tmp = tmp & "Dollars"
      End If
      If Len(CentsString) > 0 Then
         tmp = tmp & " and " & CentsString
         If CentsString = "One " Then
            tmp = tmp & "Cent"
         Else
            tmp = tmp & "Cents"
         End If
      End If
   ElseIf bUseCheck = True Then
      tmp = tmp & "and " & Left$(DecimalPart & "00", 2)
      tmp = tmp & "/100"
   ElseIf bUseCheckDollar = True Then
      If tmp = "One " Then
         tmp = tmp & "Dollar"
      Else
         tmp = tmp & "Dollars"
      End If
      tmp = tmp & " and " & Left$(DecimalPart & "00", 2)
      tmp = tmp & "/100"
   Else
      If Len(DecimalPart) > 0 Then
        tmp = tmp & "Point"
        For cnt = 1 To Len(DecimalPart)
          tmp = tmp & " " & sNumberText(Mid$(DecimalPart, cnt, 1))
        Next
      End If
   End If
  '  Done!
   NumberAsText = NumberSign & tmp
End Function
Private Sub BuildArray(sNumberText() As String)
   ReDim sNumberText(0 To 27) As String
   sNumberText(0) = "Zero"
   sNumberText(1) = "One"
   sNumberText(2) = "Two"
   sNumberText(3) = "Three"
   sNumberText(4) = "Four"
   sNumberText(5) = "Five"
   sNumberText(6) = "Six"
   sNumberText(7) = "Seven"
   sNumberText(8) = "Eight"
   sNumberText(9) = "Nine"
   sNumberText(10) = "Ten"
   sNumberText(11) = "Eleven"
   sNumberText(12) = "Twelve"
   sNumberText(13) = "Thirteen"
   sNumberText(14) = "Fourteen"
   sNumberText(15) = "Fifteen"
   sNumberText(16) = "Sixteen"
   sNumberText(17) = "Seventeen"
   sNumberText(18) = "Eighteen"
   sNumberText(19) = "Nineteen"
   sNumberText(20) = "Twenty"
   sNumberText(21) = "Thirty"
   sNumberText(22) = "Forty"
   sNumberText(23) = "Fifty"
   sNumberText(24) = "Sixty"
   sNumberText(25) = "Seventy"
   sNumberText(26) = "Eighty"
   sNumberText(27) = "Ninety"
End Sub
Private Function IsBounded(vntArray As Variant) As Boolean
  '  Note: the application in the IDE will stop
  '  at this line when first run if the IDE error
  '  mode is not set to "Break on Unhandled Errors"
  '  (Tools/Options/General/Error Trapping)
   On Error Resume Next
   IsBounded = IsNumeric(UBound(vntArray))
End Function







Private Function HundredsTensUnits(ByVal TestValue As Integer, _
                              Optional bUseAnd As Boolean) As String
   Dim CardinalNumber As Integer
   If TestValue > 99 Then
      CardinalNumber = TestValue \ 100
      HundredsTensUnits = sNumberText(CardinalNumber) & " Hundred "
      TestValue = TestValue - (CardinalNumber * 100)
   End If
   If bUseAnd = True Then
      HundredsTensUnits = HundredsTensUnits & "and "
   End If
   If TestValue > 20 Then
      CardinalNumber = TestValue \ 10
      HundredsTensUnits = HundredsTensUnits & _
                          sNumberText(CardinalNumber + 18) & " "
      TestValue = TestValue - (CardinalNumber * 10)
   End If
   If TestValue > 0 Then
      HundredsTensUnits = HundredsTensUnits & _
                          sNumberText(TestValue) & " "
   End If
End Function

package jvbz.boot.vss.inquiry.dto;

import lombok.Data;

@Data
public class InquiryDTO {
	private int inquiryNum;
	private String userId;
	private String inquiryTitle;
	private String inquiryContent;
	private String inquiryDate;
	private String inquiryAnswer;
	private int inquiryStatus;
}
